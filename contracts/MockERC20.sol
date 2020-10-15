pragma solidity ^0.5.12;

// Mock as needed for unit testing
contract ERC20 {  
    function approve(address, uint256) external pure returns (bool) {
      return true;
    }

    function transfer(address, uint256) external pure returns (bool) {
      return true;
    }
}
