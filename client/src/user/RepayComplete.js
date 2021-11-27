import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Input } from "reactstrap";
import "../App.css";

import { getName, getBalance } from "../redux/actions/user_actions";
import NavBar from "../components/Navbar";
import BackButton from "../components/BackButton";

class RepayComplete extends Component {
  async componentDidMount() {
    if (!this.props.contractAddress) {
      this.props.history.push({ pathname: "Login" });
    } else {
      this.props.getName(this.props.contractAddress);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="screens">
          <div className="Welcome">Repayment</div>

          <h2 style={{ textAlign: "left", margin: "20vh 10% 2vh 10%" }}>
            Congratulations!
          </h2>
          <div>You've repaid back 15.00 DAI of your loan!</div>
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
            onClick={() => this.props.history.push({ pathname: "/LoanDetail" })}
          >
            Back to Borrow
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
})(RepayComplete);
