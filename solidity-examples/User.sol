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

    // mapping: index -> (DAI, cToken, withdrawn)
    mapping(uint => uint) public daiDeposit;
    mapping(uint => uint) public cTokenDeposit;
    mapping(uint => uint) public cTokenWithdrawn;
    // currentIndex: next entry to withdraw from
    uint currentIndex;
    // lastIndex: next index to input a new entry
    uint lastIndex;

    constructor(address _schoolContract, string _name) {
      name = _name;
      owner = msg.sender;
      schoolContract = _schoolContract;
      currentIndex = 0;
      lastIndex = 0;
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

        if (mintResult == 0) {
            daiDeposit[lastIndex] = _numTokensToSupply;
            cTokenDeposit[lastIndex] = _numTokensToSupply / exchangeRateMantissa;
            lastIndex += 1;
        }
        return mintResult;
    }

    // redeemCErc20Tokens
    // mapping: index -> (DAI, cToken, withdrawn)
    // currentIndex: next entry to withdraw from
    // lastIndex: next index to input a new entry
    // iterate from currentIndex until amount withdrawn equals to desired amount
    // update withdrawn from each entry
    // interest = balanceOf(address owner) - sum(cToken)
    // redeem(amount) OR redeemUnderlying(amount)
    // transfer (interest / 2) * exchangeRateCurrent (in DAI) to school
    // *** amount can only be in DAI
    function withdraw(
        uint256 amount,
        address _cErc20Contract
    ) public returns (bool) {
        // Create a reference to the corresponding cToken contract, like cDAI
        CErc20 cToken = CErc20(_cErc20Contract);
        uint exchangeRateMantissa = cToken.exchangeRateCurrent();

        // `amount` is scaled up by 1e18 to avoid decimals

        if (!checkHasEnough(amount, _cErc20Contract)) {
          emit MyLog("There is not enough for the withdrawal.");
          return false;
        }

        uint256 redeemResult;
        uint interestRate = interestRate(_cErc20Contract);
        uint256 amountOfInterest = amount * interestRate;
        uint256 amountWithoutInterest = amount - amountOfInterest;

        redeemResult = cToken.redeemUnderlying(amount);

        // Error codes are listed here:
        // https://compound.finance/developers/ctokens#ctoken-error-codes
        emit MyLog("If this is not 0, there was an error", redeemResult);

        return true;
    }

    function checkHasEnough(uint256 amount, , address _cErc20Contract) private returns (bool) {
      CErc20 cToken = CErc20(_cErc20Contract);
      return amount <= currentUnderlyingBalance;
    }

    function sumOfcTokenDepositLeft() private returns (uint) {
      uint sum = 0;
      for (int i = currentIndex; i < lastIndex; i++) {
        sum += cTokenDeposit[i];
      }
      return sum;
    }

    function interestRate(address _cErc20Contract) private returns (uint) {
      CErc20 cToken = CErc20(_cErc20Contract);
      uint exchangeRateMantissa = cToken.exchangeRateCurrent();
      uint currentcTokenBalance = cToken.balanceOfUnderlying(owner) / exchangeRateMantissa;
      uint totalcTokenDepositLeft = sumOfcTokenDepositLeft();
      return currentcTokenBalance - totalcTokenDepositLeft / totalcTokenDepositLeft;
    }

    // This is needed to receive ETH when calling `redeemCEth`
    function() external payable {}
}
