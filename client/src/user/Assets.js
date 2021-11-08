import React, { Component } from "react";
import { Form, Button } from "reactstrap";
import { connect } from "react-redux";

import "../App.css";
import NavBar from "../components/Navbar";
import tokens from "../assets.json";

class Assets extends Component {
  componentDidMount() {
    // Fetch the users's balances here
  }

  renderAsset = (asset) => {
    return (
      <div
        style={{
          backgroundColor: "#ECF3FF",
          width: "40vw",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "2vw",
          borderRadius: "2vw",
          marginBottom: "3vh",
        }}
      >
        <img
          src={asset.url}
          alt={asset.symbol}
          style={{ width: "8vw", margin: "0 2vw 0 2vw" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div>User Balance</div>
          <div>{this.props.balance[asset.symbol]}</div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div style={{ width: "100vw", height: "100vh", padding: "3vh 0 2vh 0" }}>
        <div className="Welcome">Tokens Held</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100vw",
            justifyContent: "space-around",
            marginTop: "2vh",
          }}
        >
          {tokens.map((token) => this.renderAsset(token))}
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
            margin: "4vh 10vw 0 10vw",
          }}
          onClick={() => this.props.history.push({ pathname: "/Account" })}
        >
          Back{" "}
        </Button>
        <NavBar active={0} history={this.props.history} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { address, balance } = state.user;
  return { address, balance };
};

export default connect(mapStateToProps, {})(Assets);
