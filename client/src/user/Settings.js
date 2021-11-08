import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import "../App.css";

import {
  getName,
  getBalance,
  handleUserLogout,
  getContribution,
  getInterestRate,
  deposit,
  withdraw,
} from "../redux/actions/user_actions";
import { getSchoolByUser } from "../redux/actions/school_actions";
import NavBar from "../components/Navbar";

class Settings extends Component {
  state = {
    activeTab: 0,
    Balance: "",
    Deposit: "",
    Withdraw: "",
    InterestRate: "",
    Contribution: "",
    RoundedContribution: "",
    School: "",
    Name: "",
    SchoolContract: "",
    SchoolName: "",
    SchoolAddress: "",
    projects: [],
    withdrawLoading: false,
    depositLoading: false,
    dropdownOpen: false,
    dropDownValue: "Select Asset",
    activeAsset: {},
  };

  async componentDidMount() {
    if (!this.props.contractAddress) {
      this.props.history.push({ pathname: "Login" });
    } else {
      this.props.getName(this.props.contractAddress);
      this.props.getBalance(this.props.contractAddress);
      // this.props.getInterestRate(this.props.contractAddress);
      // this.props.getContribution(this.props.contractAddress);
      this.props.getSchoolByUser(this.props.contractAddress);
    }
  }
  render() {
    return (
      <div className="App">
        <div className="screens">
          <Button
            style={{
              backgroundColor: "white",
              fontWeight: "bold",
              color: "#146EFF",
              borderRadius: "10px",
              borderWidth: "3px",
              borderColor: "#146EFF",
            }}
            onClick={() => this.props.handleUserLogout(this.props.history)}
            className="LogoutButton"
          >
            Logout
          </Button>

          <NavBar active={3} history={this.props.history} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    address,
    contractAddress,
    name,
    balance,
    contribution,
    interestRate,
    depositLoading,
    withdrawLoading,
    totalBalance,
  } = state.user;
  const { projects } = state.school;
  return {
    address,
    contractAddress,
    name,
    balance,
    projects,
    contribution,
    interestRate,
    depositLoading,
    withdrawLoading,
    totalBalance,
    schoolName: state.school.name,
    schoolAddress: state.school.address,
  };
};

export default connect(mapStateToProps, {
  getName,
  getBalance,
  getSchoolByUser,
  handleUserLogout,
  getContribution,
  getInterestRate,
  deposit,
  withdraw,
})(Settings);
