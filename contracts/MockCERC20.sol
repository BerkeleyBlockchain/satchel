pragma solidity ^0.5.12;

// Mock as needed for unit testing
contract MockCERC20 {  
    uint256 balance = 1;
    uint256 exchangeRate = 1;

    function mint(uint256 _amount) external pure returns (uint256) {
      return 0;
    }

    function balanceOfUnderlying(address _address) external view returns (uint256) {
      return balance;
    }

    function exchangeRateCurrent() external view returns (uint256) {
      return exchangeRate;
    }

    function supplyRatePerBlock() external pure returns (uint256) {
      return 0;
    }

    function redeem(uint _amount) external pure returns (uint) {
      return 0;
    }

    function redeemUnderlying(uint _amount) external pure returns (uint) {
      return 0;
    }

    function setBalance(uint _amount) external returns (uint) {
      balance =  _amount;
      return balance;
    }

    function setExchangeRate(uint _amount) external returns (uint) {
      exchangeRate =  _amount;
      return exchangeRate;
    }

}
