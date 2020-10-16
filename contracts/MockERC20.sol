pragma solidity ^0.5.12;

// Mock as needed for unit testing
contract MockERC20 {  
    function approve(address _address, uint256 _amount) external pure returns (bool) {
      return true;
    }

    function transfer(address _address, uint256 _amount) external pure returns (bool) {
      return true;
    }
}
