// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./User.sol";

contract School {
    address public owner;
    string public name;
    mapping(address => address) _users;

    constructor(string memory _schoolName) public {
      name = _schoolName;
      owner = msg.sender;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function createUserContract(string memory _name) public {
        // instantiate a new user contract
        _users[msg.sender] = address(new User(address(this), _name));
    }

    function getUserContract() public view returns (address) {
        return _users[msg.sender];
    }

    function getBalance(address _erc20Contract) public view returns (uint256) {
        Erc20 underlying = Erc20(_erc20Contract);
        return underlying.balanceOf(address(this));
    }

    function withdrawBalance(uint256 amount, address _erc20Contract) public returns (uint256) {
        Erc20 underlying = Erc20(_erc20Contract);
        uint256 balance = underlying.balanceOf(address(this));
        require (balance <= amount, "cannot withdraw more than balance");
        underlying.transfer(owner, amount);

        return underlying.balanceOf(address(this));
    }

    receive() external payable {}
    fallback() external payable {}
}