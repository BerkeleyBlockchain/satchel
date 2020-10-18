pragma solidity ^0.5.12;

// Mock as needed for unit testing
contract MockSchool {  
    uint256 balance = 0;

    function transfer(uint256 _amount) external returns (bool) {
      balance += _amount;
      return true;
    }

    function getBalance() external view returns(uint256) {
        return balance;
    }
}
