pragma solidity ^0.7.0;

import "./School.sol";

contract SchoolFactory {
    
    School[] public schoolArray;
    mapping(uint256 => address) internal schoolToOwner;
    mapping(address => uint256) internal ownerSchoolCount;
    
    event newSchoolEvent(uint256 schoolId, string schoolName);
    
    modifier schoolExists(uint256 schoolId) {
        require(schoolId < schoolArray.length, "School does not exist");
        _;
    }
    
    function newSchool(string calldata _schoolName) public {
        schoolArray.push(new School(_schoolName));
        uint256 id = schoolArray.length - 1;
        schoolToOwner[id] = msg.sender;
        ownerSchoolCount[msg.sender]++;
        emit newSchoolEvent(id, _schoolName);
    }
    
    function getSchoolBalance(uint256 schoolId, address _erc20Contract) public view schoolExists(schoolId) returns (uint256) {
        return schoolArray[schoolId].getBalance(_erc20Contract);
    }
    
    function getSchoolName(uint256 schoolId) public view schoolExists(schoolId) returns (string memory){
        return schoolArray[schoolId].getName();
    }
    
    function withdrawBalance(uint256 schoolId, uint256 amount, address _erc20Contract) public schoolExists(schoolId) returns (uint256) {
        return schoolArray[schoolId].withdrawBalance(amount, _erc20Contract);
    }
    
    function getSchoolByOwner(address _owner) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](ownerSchoolCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < schoolArray.length; i++) {
            if (schoolToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    // Probably get school data by id too
}