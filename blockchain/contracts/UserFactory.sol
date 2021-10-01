// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./User.sol";
import "./SchoolFactory.sol";

contract UserFactory is SchoolFactory {
    
    mapping(address => address) _users;
    
    function createUserContract(string memory _name, address payable schoolAddress) public {
        // instantiate a new user contract
        _users[msg.sender] = address(new User(schoolAddress, _name, msg.sender));
    }

    function getUserContract() public view returns (address) {
        return _users[msg.sender];
    }
    
}