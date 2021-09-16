import React, { Component } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import Web3 from "web3";
import contractAbi from "../abi/UnicefSatchel.json";

import "../App.css";
import logo from "../logo.png";
import axios from "axios";
import SchoolPanel from "../components/SchoolPanel.js";

// note, contract address must match the address provided by Truffle after migrations
const web3 = new Web3(Web3.givenProvider);

// const privateKey =
//   "0xb8c1b5c1d81f9475fdf2e334517d29f733bdfa40682207571b12fc1142cbf329";

// // Add your Ethereum wallet to the Web3 object
// web3.eth.accounts.wallet.add(privateKey);
// const myWalletAddress = web3.eth.accounts.wallet[0].address;

// const fromMyWallet = {
//   from: myWalletAddress,
//   gasLimit: web3.utils.toHex(1000000),
//   gasPrice: web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
// };

// var TruffleContract = require("truffle-contract");
// var School = TruffleContract(schoolJSON);
// School.setProvider(Web3.givenProvider);
class SelectSchool extends Component {
  constructor(props) {
    super(props);
    let receivedProps = this.props.location.state;
    console.log(receivedProps);
    this.state = {
      schools: [],
      Name: "",
    };
    this.setName = this.setName.bind(this);
    this.getSchools();
  }

  getSchools = async () => {
    await axios
      .get("http://localhost:4000/api/school/allSchools")
      .then((res) => this.setState({ schools: res.data.schools }));
  };

  setName = async (e) => {
    e.preventDefault();
    const x = e.target.value;
    this.setState({ Name: x });
  };

  login = async (school) => {
    let contractInstance = new web3.eth.Contract(
      contractAbi.abi,
      process.env.REACT_APP_CONTRACT_ADDRESS
    );

    const self = this;

    try {
      if (!window.ethereum) {
        console.log("Metamask not installed");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      let userContractAddress = await contractInstance.methods
        .getUserContract()
        .call({ from: accounts[0] });
      console.log("user addresss: " + userContractAddress);
      console.log("account[0]" + accounts[0]);
      if (userContractAddress == "0x0000000000000000000000000000000000000000") {
        await contractInstance.methods
          .createUserContract(self.state.Name, school.address)
          .send({ from: accounts[0] });

        userContractAddress = await contractInstance.methods
          .getUserContract()
          .call({ from: accounts[0] });
        console.log(userContractAddress);
        self.state.UserContractAddress = userContractAddress;
        self.props.history.push({
          pathname: "/Dashboard",
          state: {
            UserContractAddress: userContractAddress,
            Name: self.state.Name,
          },
        });
      } else {
        console.log("You already have an account");
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div className="App">
        <div className="LoginItems">
          <div>
            {" "}
            <img src={logo} alt="Logo" height={35} width={35} />{" "}
          </div>

          <div className="LoginWelcome">{"Welcome to Satchel!"}</div>

          <div className="Slogan">
            Satchel donates a portion of interest earned on your savings to a
            local school to help fund community projects.
          </div>
          <div className="Slogan">
            In order to set up an account, you'll need to select a school that
            will receive your donations.
          </div>

          <Form>
            <FormGroup className="NameField">
              <Label for="amount"></Label>
              <Input
                onChange={this.setName}
                type="text"
                name="text"
                id="amount"
                placeholder="Enter your name"
                style={{
                  backgroundColor: "#ECF3FF",
                  color: "black",
                  borderRadius: "10px",
                  border: "white",
                  fontSize: "15px",
                }}
              />
            </FormGroup>
          </Form>

          {this.state.schools.length > 0
            ? this.state.schools.map((school) => (
                <div className="PanelWidth" onClick={() => this.login(school)}>
                  <SchoolPanel school={school}></SchoolPanel>
                </div>
              ))
            : null}
          <div className="SchoolLogin"></div>
        </div>
      </div>
    );
  }
}

export default SelectSchool;
