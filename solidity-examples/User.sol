pragma solidity ^0.5.12;


interface Erc20 {
    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);
}


interface CErc20 {
    function mint(uint256) external returns (uint256);

    function exchangeRateCurrent() external returns (uint256);

    function supplyRatePerBlock() external returns (uint256);

    function redeem(uint) external returns (uint);

    function redeemUnderlying(uint) external returns (uint);
}

contract User {
    event MyLog(string, uint256);

    address schoolContract;
    address owner;
    string name;

    uint public cTokenBalance;

    constructor(address _schoolContract, string _name) {
      name = _name;
      owner = msg.sender;
      schoolContract = _schoolContract;
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
            cTokenBalance += _numTokensToSupply / exchangeRateMantissa;
        }
        return mintResult;
    }

    function withdraw(
        uint256 amount,
        address _cErc20Contract
    ) public returns (bool) {
        // Create a reference to the corresponding cToken contract, like cDAI
        CErc20 cToken = CErc20(_cErc20Contract);
        uint exchangeRateMantissa = cToken.exchangeRateCurrent();


        // Calculate the current interest rate
        uint interestRate = interestRate(_cErc20Contract);

        // Calculating requested amount without interest
        uint256 amountWithoutInterest = amount/(1 + interestRate/2);

        // Ensure the user has enough supplied to compound to withdraw requested amount
        if (!checkHasEnough(amountWithoutInterest*(1 + interestRate), _cErc20Contract)) {
          emit MyLog("There is not enough for the withdrawal.");
          return false;
        }

        // Redeem the amount with interest
        uint256 redeemResult = cToken.redeemUnderlying(amountWithoutInterest*(1 + interestRate));


        if (redeemResult == 0) {
            // If redeem is successful, decrement our cTokenBalance by the amount in cToken withdrawn
            cTokenBalance -= amountWithoutInterest/exchangeRateMantissa;
            // Transfer half of garnered interest to the school
            schoolContract.transfer((amountWithoutInterest*interestRate)/2);

        }

        // Error codes are listed here:
        // https://compound.finance/developers/ctokens#ctoken-error-codes
        emit MyLog("If this is not 0, there was an error", redeemResult);

        return true;
    }

    // Ensures the user has enough deposited to withdraw amount
    function checkHasEnough(uint256 amount, address _cErc20Contract) private returns (bool) {
      CErc20 cToken = CErc20(_cErc20Contract);
      return amount <= cToken.balanceOfUnderlying(owner);
    }

    // Calculate current average interest rate
    function interestRate(address _cErc20Contract) private returns (uint) {
      CErc20 cToken = CErc20(_cErc20Contract);
      uint exchangeRateMantissa = cToken.exchangeRateCurrent();
      uint currentcTokenBalance = cToken.balanceOfUnderlying(owner) / exchangeRateMantissa;
      return (currentcTokenBalance - ctokenBalance) / ctokenBalance;
    }

    // This is needed to receive ETH when calling `redeemCEth`
    function() external payable {}
}
