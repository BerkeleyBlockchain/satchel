// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./floating_point/Exponential.sol";

interface Erc20 {
    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);

    function balanceOf(address) external view returns (uint256 balance);

    function transferFrom(
        address,
        address,
        uint
    ) external returns (bool);
}


interface CErc20 is Erc20 {
    function mint(uint256) external returns (uint256);

    function balanceOfUnderlying(address) external returns (uint256);

    function redeemUnderlying(uint) external returns (uint);
}

interface Comptroller {
    function enterMarkets(address[] calldata cTokens) external returns (uint[] memory);

    function exitMarket(address cToken) external returns (uint);
}

contract User is Exponential {
    // School addr, token addr, amount
    event SendToSchool(address, address, uint256);
    event InsufficientBalance(string);

    address payable public schoolContract;
    address public owner;
    string public name;
    bool public community;
    // Keep track of how much the user deposited in underlying token
    // underlyingToken => amount deposited
    mapping(address => uint256) public underlyingAmountDeposited;
    mapping(address => uint256) public schoolContributions;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }


    struct FloatingPoint {
        Exp fractionToWithdraw;
        Exp interestToWithdraw;
        Exp halfWithdrawnInterest;
    }
        

    constructor(address payable _schoolContract, string memory _name, bool _community, address payable _owner) public {
      name = _name;
      community = _community;
      owner = _owner;
      schoolContract = _schoolContract;
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
    ) public onlyOwner returns (uint) {

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

        require(mintResult == 0, "Failure when attempting to mint cTokens");

        // If mint is successful, then update the underlyingAmountDeposited for this token
        (MathError err0, uint result) = addUInt(underlyingAmountDeposited[address(underlying)], _numTokensToSupply);
        require(err0 == MathError.NO_ERROR, "error updating initial balance of user");
        underlyingAmountDeposited[address(underlying)] = result;

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
    ) public onlyOwner returns (uint) {
        MathError mErr;
        uint256 interestEarned;
        uint256 interestToSendToSchool;
        uint256 amountForUser;
        uint256 totalInterestWithdrawn;
        uint256 amountWithdrawnFromDeposit;
        FloatingPoint memory floatingPoint;
        

        // Create a reference to the corresponding cToken contract, like cDAI
        Erc20 underlying = Erc20(_erc20Contract);
        CErc20 cToken = CErc20(_cErc20Contract);
        uint256 underlyingBalance = cToken.balanceOfUnderlying(address(this));

        if (amount > underlyingBalance) {
            emit InsufficientBalance("There is not enough for the withdrawal.");
            revert("Failure: Attempting to withdraw more than you own.");
        }

        // First, let's redeem the cTokens for actual underlying
        require(cToken.redeemUnderlying(amount) == 0, "Failed to redeem cTokens for underlying token");
        
        // Let's calculate the fraction of the user's total asset they are trying to withdraw
        // e.g. if you have 100 dai and are trying to withdraw 50, then we would get 1/2 
        // Solidity does not support floating point, so this does (amount / underlyingBalance) * 1e18
        (mErr, floatingPoint.fractionToWithdraw) = getExp(amount, underlyingBalance);
        if (mErr != MathError.NO_ERROR) {
            revert("Exponential Failure when calculating fractionToWithdraw");
        }

        // Let's calculate how much interest the user has earned
        (mErr, interestEarned) = subUInt(underlyingBalance, underlyingAmountDeposited[address(underlying)]);
        if (mErr != MathError.NO_ERROR) {
            revert("Arithmetic Failure when calculating interestEarned");
        }
        
        // Now of the total amount to withdraw, we want to calculate how much of it was gained from interest
        (mErr, floatingPoint.interestToWithdraw) = mulScalar(floatingPoint.fractionToWithdraw, interestEarned);
        if (mErr != MathError.NO_ERROR) {
            revert("Exponential Failure when calculating interestToWithdraw");
        }

        // Now calculate half of the amount generated from interest
        if (community) {
            (mErr, floatingPoint.halfWithdrawnInterest) = divScalar(floatingPoint.interestToWithdraw, 2);
            if (mErr != MathError.NO_ERROR) {
                revert("Exponential Failure when calculating halfWithdrawnInterest");
            }
            // Convert Exponential back into native units of the underlying token
            interestToSendToSchool = floatingPoint.halfWithdrawnInterest.mantissa / expScale;
        } else {
            // Non-community member: the whole interest goes to school, and convert exp back into native units
            interestToSendToSchool = floatingPoint.interestToWithdraw.mantissa / expScale;
        }

        // Now the user will get the amount to withdraw, minus the interest that went to the school
        (mErr, amountForUser) = subUInt(amount, interestToSendToSchool);
        if (mErr != MathError.NO_ERROR) {
            revert("Arithmetic Failure when calculating amount to send to user");
        }

        require(underlying.transfer(schoolContract, interestToSendToSchool), "Error transferring funds to school");
        emit SendToSchool(schoolContract, address(underlying), interestToSendToSchool);
        require(underlying.transfer(msg.sender, amountForUser), "Error transferring funds to user");

        // Bookkeeping: Now we need to identify the amount withdrawn that came from the initial deposit (not from interest)
        if (community) {
            (mErr, totalInterestWithdrawn) = mulUInt(interestToSendToSchool, 2);
            if (mErr != MathError.NO_ERROR) {
                revert("Arithmetic Failure when calculating totalInterestWithdrawn");
            }
        } else {
            totalInterestWithdrawn = interestToSendToSchool;
        }

        (mErr, amountWithdrawnFromDeposit) = subUInt(amount, totalInterestWithdrawn);
        if (mErr != MathError.NO_ERROR) {
            revert("Arithmetic Failure when calculating new value for amountWithdrawnFromDeposit");
        }

        (mErr, underlyingAmountDeposited[address(underlying)]) = subUInt(underlyingAmountDeposited[address(underlying)], amountWithdrawnFromDeposit);
        if (mErr != MathError.NO_ERROR) {
            revert("Arithmetic Failure when calculating nnewUnderlyingAmountDeposited");
        }

        // underlyingAmountDeposited[address(underlying)] = newUnderlyingAmountDeposited;
        schoolContributions[address(underlying)] += interestToSendToSchool;

        // Indicate success
        return 0;
    }

    function getBalance(address _erc20Contract) public view returns(uint256) {
        Erc20 underlying = Erc20(_erc20Contract);
        return underlying.balanceOf(msg.sender);
    }

    /** Allows the user to enter the market
     * This is necessary in order to begin borrowing from any market on Compound
     * @param - comptroller is the address of the compound comptroller 
     * @param - cTokens is an array of addresses of cTokens whose market we wish to enter
     * @return - array of integers, one element for each cToken market. 0 if success, else error
     */
    function enterMarkets(address comptroller, address[] calldata cTokens) public returns (uint[] memory) {
        return Comptroller(comptroller).enterMarkets(cTokens);
    }

    /** Allows the user to exit the market
     * This changes the assets that compound uses to calculate account liquidity
     * @param - comptroller is the address of the compound comptroller 
     * @param - cToken is the address of the cToken whose market we wish to exit
     * @return - 0 on success else error
     */
    function exitMarket(address comptroller, address cToken) public returns (uint) {
        return Comptroller(comptroller).exitMarket(cToken);
    }

    // This is needed to receive ETH when calling `redeemCEth`
    receive() external payable {}
    fallback() external payable {}
}
