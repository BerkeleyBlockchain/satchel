pragma solidity ^0.5.12;

// Mock as needed for unit testing
contract MockCERC20 {  
    function mint(uint256 _amount) external pure returns (uint256) {
      return _amount;
    }

    function balanceOfUnderlying(address _address) external pure returns (uint256) {
      return 1;
    }

    function exchangeRateCurrent() external pure returns (uint256) {
      return 1;
    }

    function supplyRatePerBlock() external pure returns (uint256) {
      return 0;
    }

    function redeem(uint _amount) external pure returns (uint) {
      return _amount;
    }

    function redeemUnderlying(uint _amount) external pure returns (uint) {
      return _amount;
    }
}
