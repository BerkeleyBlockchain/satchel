// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./floating_point/Exponential.sol";

interface Erc20 {
    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);

    function balanceOf(address) external view returns (uint256 balance);

    function decimals() external view returns (uint8);

    function transferFrom(
        address,
        address,
        uint
    ) external returns (bool);
}


interface CErc20 is Erc20 {
    function mint(uint256) external returns (uint256);

    function balanceOfUnderlying(address) external returns (uint256);

    function exchangeRateCurrent() external returns (uint256);

    function supplyRatePerBlock() external returns (uint256);

    function redeem(uint) external returns (uint);

    function redeemUnderlying(uint) external returns (uint);
}

contract User is Exponential {
    event MyLog(string, uint256);
    // School addr, token addr, amount
    event SendToSchool(address, address, uint256);
    event InsufficientBalance(string);

    address payable public schoolContract;
    address public owner;
    string public name;

    //TODO - have a modifier to make sure only owner can call these withdraw/deposit functions

    // Keep track of how much the user deposited in underlying token
    // underlyingToken => amount deposited
    mapping(address => uint256) underlyingAmountDeposited;

    mapping(address => uint256) schoolContributions;

    uint256 public cTokenBalance;
    uint256 public avgExchangeRate;

    constructor(address payable _schoolContract, string memory _name) public {
      name = _name;
      owner = msg.sender;
      schoolContract = _schoolContract;
      cTokenBalance = 0;
      schoolContributions = 0;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;

        return c;
    }

    /**
     * Allow a user to deposit tokens into the COMP protocol
     * NOTE: Users must call _erc20Contract.approve() before calling this function
     * since we this contract will be using their tokens to deposit into compound
     * @param _erc20Contract the ERC contract for the underlying token
     * @param _cErc20Contract the ERC contract for the CToken
     * @param _numTokensToSupply the number of underlying tokens to supply
     * @return (uint) - 0 on success, else an int to represent the error
     */
    function deposit(
        address _erc20Contract,
        address _cErc20Contract,
        uint256 _numTokensToSupply
    ) public returns (uint) {

        //TODO: msg.sender vs tx.origin nuances
        // I think the user needs to first give us their numTokensToSupply
        // before we call underlying.approve and stuff. 

        // Create a reference to the underlying asset contract, like DAI.
        Erc20 underlying = Erc20(_erc20Contract);

        // Create a reference to the corresponding cToken contract, like cDAI
        CErc20 cToken = CErc20(_cErc20Contract);

        // Assumes that user has already called underlying.approve()
        // Transfer tokens from sender to this contract
        require(underlying.transferFrom(msg.sender, address(this), _numTokensToSupply), "Failure: Could not transfer tokens from user to contract");

        // Approve cToken contract to use our funds 
        underlying.approve(_cErc20Contract, _numTokensToSupply);

        // Mint cTokens
        uint mintResult = cToken.mint(_numTokensToSupply);

        // If mint is successful, then update the underlyingAmountDeposited for this token
        if (mintResult == 0) {
            (MathError err0, uint result) = addUInt(underlyingAmountDeposited[underlying], _numTokensToSupply);
            require(err0 == MathError.NO_ERROR, "error updating initial balance of user");
            underlyingAmountDeposited[underlying] = result;
        }

        return mintResult;
    }

    /**
     * @param amount - the amount in underlying the user wishes to withdraw
     * @param _erc20Contract the ERC contract for the underlying token
     * @param _cErc20Contract the ERC contract for the CToken
     * @return (uint) - 0 on success, else reverts
     */
    function withdraw(
        uint256 amount, 
        address _erc20Contract,
        address _cErc20Contract
    ) public returns (uint) {
        // Create a reference to the corresponding cToken contract, like cDAI
        Erc20 underlying = Erc20(_erc20Contract);
        CErc20 cToken = CErc20(_cErc20Contract);
        uint256 underlyingBalance = cToken.balanceOfUnderlying(msg.sender);

        if (amount > underlyingBalance) {
            emit InsufficientBalance("There is not enough for the withdrawal.");
            revert("Failure: Attempting to withdraw more than you own.");
        }

        // First, let's redeem the cTokens for actual underlying
        require(cToken.redeemUnderlying(amount) == 0, "Failed to redeem cTokens for underlying token");
        
        // Let's calculate the fraction of the user's total asset they are trying to withdraw
        // e.g. if you have 100 dai and are trying to withdraw 50, then we would get 1/2 
        // Solidity does not support floating point, so this does (amount / underlyingBalance) * 1e18
        Exp memory fractionToWithdraw = getExp(amount, underlyingBalance);
        // Let's calculate how much interest the user has earned
        (MathError err0, uint256 interestEarned) = subUInt(underlyingBalance, underlyingAmountDeposited[underlying]);
        if (err0 != MathError.NO_ERROR) {
            revert("Arithmetic Failure when calculating interestEarned");
        }
        
        // Now of the total amount to withdraw, we want to calculate how much of it was gained from interest
        Exp memory interestToWithdraw = mulScalar(fractionToWithdraw, interestEarned);

        // Now calculate half of the amount generated from interest
        Exp memory halfWithdrawnInterest = divScalar(interestToWithdraw, 2);
        // Convert Exponential back into native units of the underlying token
        uint256 interestToSendToSchool = halfWithdrawnInterest.mantissa / expScale;

        // Now the user will get the amount to withdraw, minus the interest that went to the school
        (MathError err1, uint256 amountForUser) = subUInt(amount, interestToSendToSchool);
        if (err1 != MathError.NO_ERROR) {
            revert("Arithmetic Failure when calculating amount to send to user");
        }

        underlying.transfer(schoolContract, interestToSendToSchool);
        emit SendToSchool(schoolAddress, underlying, interestToSendToSchool);
        underlying.transfer(msg.sender, amountForUser);

        // Bookkeeping: Now we need to identify the amount withdrawn that came from the initial deposit (not from interest)
        (MathError err2, uint256 amountWithdrawnFromDeposit) = subUInt(amount, mulUInt(interestToSendToSchool, 2));
        if (err2 != MathError.NO_ERROR) {
            revert("Arithmetic Failure when calculating new value for amountWithdrawnFromDeposit");
        }
        underlyingAmountDeposited[underlying] = subUInt(underlyingAmountDeposited[underlying], amountWithdrawnFromDeposit);
        schoolContributions[underlying] += interestToSendToSchool;

        // Indicate success
        return 0;

    }

    function withdraw(
        uint256 amount,
        address _erc20Contract,
        address _cErc20Contract
    ) public returns (bool) {
        // Create a reference to the corresponding cToken contract, like cDAI
        Erc20 underlying = Erc20(_erc20Contract);
        CErc20 cToken = CErc20(_cErc20Contract);
        uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();

        // Calculate the current interest rate
        uint256 interest_rate = interestRate(_cErc20Contract);


        // Calculating requested amount without interest
        uint256 amountWithoutInterest = div(mul(amount, 1e18), add(1e18, div(interest_rate, 2))); //amount * 100/(100 + interest_rate/2);
        uint256 totalWithdraw = div(mul(amountWithoutInterest, add(1e18, interest_rate)), 1e18); //(amountWithoutInterest*(100 + interest_rate))/100;

        // Ensure the user has enough supplied to compound to withdraw requested amount
        if (!checkHasEnough(totalWithdraw, _cErc20Contract)) {
            emit InsufficientBalance("There is not enough for the withdrawal.");
            return false;
        }

        // // Redeem the amount with interest
        uint256 redeemResult = cToken.redeemUnderlying(totalWithdraw);

        if (redeemResult == 0) {
            // If redeem is successful, decrement our cTokenBalance by the amount in cToken withdrawn
            cTokenBalance = sub(cTokenBalance, div(mul(amountWithoutInterest, 1e18), exchangeRateMantissa));     // -= amountWithoutInterest * 1e18 /exchangeRateMantissa;
            // Transfer half of garnered interest to the school
            emit MyLog("transfering to school contract", sub(totalWithdraw, amount));
            schoolContributions += sub(totalWithdraw, amount);
            underlying.transfer(schoolContract, sub(totalWithdraw, amount));
            underlying.transfer(msg.sender, amount);
        }

        // Error codes are listed here:
        // https://compound.finance/developers/ctokens#ctoken-error-codes
        emit MyLog("If this is not 0, there was an error", redeemResult);

        return true;
    }


    // Ensures the user has enough deposited to withdraw amount
    function checkHasEnough(uint256 amount, address _cErc20Contract) public returns (bool) {
      CErc20 cToken = CErc20(_cErc20Contract);
      emit MyLog("amount = ", amount);
      emit MyLog("balanceOfUnderlying", cToken.balanceOfUnderlying(address(this)));
      return amount <= cToken.balanceOfUnderlying(address(this));
    }

    // Calculate current average interest rate
    function interestRate(address _cErc20Contract) public returns (uint256) {
      if (cTokenBalance == 0) {
          return 0;
      }

      CErc20 cToken = CErc20(_cErc20Contract);
      uint256 curBalance = cToken.balanceOfUnderlying(address(this));
      uint256 avgBalance = div(mul(cTokenBalance, avgExchangeRate), 1e18);

      emit MyLog("curBalance", curBalance);
      emit MyLog("avgBalance", avgBalance);
      emit MyLog("curBalance - avgBalance", curBalance - avgBalance);

      if (curBalance < avgBalance) {
          emit MyLog("interest rate", 0);
          return 0;
      }

      return div(mul(1e18, sub(curBalance, avgBalance)), avgBalance); //100 * (currentcTokenBalance - cTokenBalance) / cTokenBalance;

    }


    function getBalance(address _cErc20Contract) public returns (uint) {
        CErc20 cToken = CErc20(_cErc20Contract);
        uint exchangeRateMantissa = cToken.exchangeRateCurrent();
        uint bal =  mul(add(cTokenBalance, div(mul(cTokenBalance, interestRate(_cErc20Contract)), 2e18)), exchangeRateMantissa); //(cTokenBalance + (cTokenBalance * interestRate(_cErc20Contract))/200) * exchangeRateMantissa;
        return bal;
    }

    function getContribution() public view returns (uint256) {
      return schoolContributions;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    // This is needed to receive ETH when calling `redeemCEth`
    receive() external payable {}
    fallback() external payable {}
}
