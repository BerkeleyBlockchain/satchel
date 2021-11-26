import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Input } from "reactstrap";
import "../App.css";

import { getName, getBalance } from "../redux/actions/user_actions";
import NavBar from "../components/Navbar";
import BackButton from "../components/BackButton";

class RepayLoan extends Component {
  state = {
    amount: "",
  };

  async componentDidMount() {
    if (!this.props.contractAddress) {
      this.props.history.push({ pathname: "Login" });
    } else {
      this.props.getName(this.props.contractAddress);
    }
  }

  render() {
    console.log(this.state.amount);
    const data = [
      { title: "Loan", data: "New House" },
      { title: "Due Date", data: "12/18/2022" },
      { title: "Amount Owed", data: "45.00 DAI" },
    ];

    return (
      <div className="App">
        <div className="screens">
          <BackButton
            onClick={() => this.props.history.push({ pathname: "Loans" })}
            text="BORROW"
          />
          <div className="Welcome">Repay Loan</div>
          <div style={{ textAlign: "left", marginLeft: "10%" }}>
            You are repaying for
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "2px solid #D4E4FF",
              borderRadius: "4vw",
              margin: "4vh 10% 0 10%",
              padding: "1.5vw",
              color: "#727A89",
            }}
          >
            {data.map((element) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "1.5vw 3vw 1.5vw 3vw",
                  width: "100%",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{element.title}</div>
                <div>{element.data}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "left", margin: "4vh 10% 2vh 10%" }}>
            How much would you like to repay?
          </div>
          <Input
            type="number"
            style={{
              backgroundColor: "#ECF3FF",
              color: "black",
              borderRadius: "10px",
              border: "white",
              fontSize: "12px",
              width: "80vw",
              margin: "2vh 10% 0 10%",
            }}
            onChange={(event) => this.setState({ amount: event.target.value })}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: "4vh 10% 0 10%",
            }}
          >
            <Button
              style={{
                backgroundColor: "white",
                fontWeight: "bold",
                color: "#146EFF",
                borderRadius: "10px",
                borderWidth: "3px",
                borderColor: "#146EFF",
                width: "35vw",
              }}
              onClick={() =>
                this.props.history.push({
                  pathname: "LoanDetail",
                  state: { amount: this.state.amount },
                })
              }
              className="LogoutButton"
            >
              Cancel
            </Button>

            <Button
              style={{
                backgroundColor: "#146EFF",
                color: "white",
                fontWeight: "bold",
                borderRadius: "10px",
                width: "35vw",
              }}
              type="submit"
            >
              Continue
            </Button>
          </div>

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
})(RepayLoan);
