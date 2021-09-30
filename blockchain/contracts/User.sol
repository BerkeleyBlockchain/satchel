pragma solidity ^0.6.12;

interface Erc20 {
    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);

    function balanceOf(address) external view returns (uint256 balance);
}


interface CErc20 {
    function mint(uint256) external returns (uint256);

    function balanceOfUnderlying(address) external returns (uint256);

    function exchangeRateCurrent() external returns (uint256);

    function supplyRatePerBlock() external returns (uint256);

    function redeem(uint) external returns (uint);

    function redeemUnderlying(uint) external returns (uint);
}

contract User {
    event MyLog(string, uint256);
    event InsufficientBalance(string);

    address payable public schoolContract;
    address public owner;
    string public name;

    uint256 public cTokenBalance;
    uint256 public avgExchangeRate;
    uint256 public schoolContributions;

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



    // supplyErc20ToCompound
    function deposit(
        address _erc20Contract,
        address _cErc20Contract,
        uint256 _numTokensToSupply
    ) public returns (uint) {
        // Create a reference to the underlying asset contract, like DAI.
        Erc20 underlying = Erc20(_erc20Contract);

        // Create a reference to the corresponding cToken contract, like cDAI
        CErc20 cToken = CErc20(_cErc20Contract);
        uint exchangeRateMantissa = cToken.exchangeRateCurrent();

        // Approve transfer on the ERC20 contract
        underlying.approve(_cErc20Contract, _numTokensToSupply);

        // Mint cTokens
        uint mintResult = cToken.mint(_numTokensToSupply);

        // If deposit is successful, add number of supplied cTokens to running cToken balance
        if (mintResult == 0) {
            uint256 minted = div(mul(_numTokensToSupply, 1e18), exchangeRateMantissa);
            uint256 cTokenBalanceOld = cTokenBalance;
            cTokenBalance = add(cTokenBalance, minted);//+= _numTokensToSupply * 1e18 / exchangeRateMantissa;
            avgExchangeRate = div(add(mul(avgExchangeRate, cTokenBalanceOld), mul(exchangeRateMantissa, minted)), cTokenBalance);
        }

        return mintResult;
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
    fallback() external payable {}
}
