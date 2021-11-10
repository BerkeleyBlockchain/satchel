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
import BackButton from "../components/BackButton";
import PieChartOutlineIcon from "@material-ui/icons/PieChart";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import EventIcon from "@material-ui/icons/Event";

class Loans extends Component {
  state = {};

  async componentDidMount() {
    if (!this.props.contractAddress) {
      this.props.history.push({ pathname: "Login" });
    } else {
      this.props.getName(this.props.contractAddress);
      // this.props.getBalance(this.props.contractAddress);
      // this.props.getInterestRate(this.props.contractAddress);
      // this.props.getContribution(this.props.contractAddress);
      // this.props.getSchoolByUser(this.props.contractAddress);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="screens">
          <BackButton
            onClick={() => this.props.history.push({ pathname: "Loans" })}
            text="BORROW"
          />
          <div className="Welcome">Loan For House</div>
          <div style={{ textAlign: "left", marginLeft: "10%" }}>
            Loan Description stuff stuff{" "}
          </div>
          <div
            style={{
              margin: "7vh 10% 0 10%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <PieChartOutlineIcon fontSize="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginLeft: "5vw",
              }}
            >
              <div style={{ color: "#146EFF" }}>Remaining Due</div>
              <div style={{ fontSize: "200%" }}> 45.00 DAI</div>
            </div>
          </div>

          <div
            style={{
              margin: "7vh 10% 0 10%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <ShowChartIcon fontSize="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginLeft: "5vw",
              }}
            >
              <div style={{ color: "#146EFF" }}>Remaining Due</div>
              <div style={{ fontSize: "200%" }}> 45.00 DAI</div>
            </div>
          </div>

          <div
            style={{
              margin: "7vh 10% 0 10%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <EventIcon fontSize="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginLeft: "5vw",
              }}
            >
              <div style={{ color: "#146EFF" }}>Remaining Due</div>
              <div style={{ fontSize: "200%" }}> 45.00 DAI</div>
            </div>
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
              width: "80vw",
              margin: "4vh 10% 0 10%",
            }}
            type="submit"
          >
            Repay
          </Button>

          <NavBar active={1} history={this.props.history} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { address, contractAddress, name } = state.user;
  return {
    address,
    contractAddress,
    name,
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
})(Loans);
