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
import LoanCard from "../components/LoanCard";
import NavBar from "../components/Navbar";

class Dashboard extends Component {
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

  setDeposit = (event) => {
    event.preventDefault();
    const x = event.target.value;
    this.setState({ Deposit: x });
  };

  setWithdraw = (event) => {
    event.preventDefault();
    const x = event.target.value;
    this.setState({ Withdraw: x });
  };

  toggle = (event, tab) => {
    event.preventDefault();
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  toggleAsset = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  render() {
    console.log("User Address: ", this.props.contractAddress);
    return (
      <div className="App">
        <div className="screens">
          <div className="Welcome">Borrow</div>
          <div
            className="Balance"
            onClick={() => this.props.history.push({ pathname: "/Assets" })}
          >
            <div className="BalanceTitle">Credit Score</div>
            <div className="BalanceAmount">500/800</div>
          </div>
          <Button
            style={{
              backgroundColor: "#146EFF",
              color: "white",
              fontWeight: "bold",
              borderRadius: "10px",
              borderWidth: "0px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "70vw",
              margin: "4vh 10% 0 10%",
            }}
            type="submit"
          >
            Take out a New Loan{" "}
          </Button>
          <div className="Welcome">Active Loans</div>
          <LoanCard date="10/01/2020" name="New House" amount="45.00 DAI" />
          <div className="Welcome">Past Loans</div>
          <NavBar active={1} history={this.props.history} />
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
})(Dashboard);
