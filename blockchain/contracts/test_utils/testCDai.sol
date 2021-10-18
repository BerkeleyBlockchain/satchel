// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

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

    function balanceOfUnderlying(address) external view returns (uint256);

    function redeemUnderlying(uint) external returns (uint);
}

contract testCDai is CErc20 {
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    address payable dai;

    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);

    // Number of cDai equal to 1 Dai (we leave it fixed)
    uint256 exchangeRate = 5;

    using SafeMath for uint256;

    constructor(address payable _dai) {
        dai = _dai;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    // Expect amt to be in base units (so typically 1e^18)
    // Set balance of cDai
    function setBalance(address address_to_set, uint256 amt) external {
        balances[address_to_set] = amt;
    }

    // Will mint 5*underlying_amt of cDai
    function mint(uint256 underlying_amt) external override returns (uint256) {
        bool transferSuccess = Erc20(dai).transferFrom(msg.sender, address(this), underlying_amt);
        require(transferSuccess, "Failure transferring Dai from sender to Dai contract.");
        balances[msg.sender] = balances[msg.sender].add(underlying_amt.mul(exchangeRate));
        return balances[msg.sender];
    }

    function balanceOfUnderlying(address user) external view override returns (uint256) {
        return balances[user].div(exchangeRate);
    }

    // Amt is the amount in underlying (so Dai)
    function redeemUnderlying(uint256 amt) external override returns (uint256) {
        require(balances[msg.sender].div(exchangeRate) <= amt, "Trying to redeem more in underlying than owned");
        balances[msg.sender] = balances[msg.sender].sub(amt.mul(exchangeRate));
        bool transferSuccess = Erc20(dai).transfer(msg.sender, amt);
        require(transferSuccess, "Failure transferring Dai From contract back to user.");
        // 0 to indicate no error
        return 0;
    }
}