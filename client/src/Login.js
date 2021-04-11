import React, { Component } from "react";
import {
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Card,
  CardText,
  CardTitle,
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import Web3 from "web3";
import { userAbi, erc20Abi, schoolAbi, schoolJSON } from "./abi/abis";
import contractAbi from "./abi/UnicefSatchel.json";

import "./App.css";
import BusinessCenterOutlinedIcon from "@material-ui/icons/BusinessCenterOutlined";
import logo from "./logo.png";

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
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      UserContractAddress: "",
    };
    this.setName = this.setName.bind(this);
    this.login = this.login.bind(this);
    this.schoolLogin = this.schoolLogin.bind(this);
  }

  setName = async (e) => {
    e.preventDefault();
    const x = e.target.value;
    this.setState({ Name: x });
  };

  schoolLogin = async (e) => {
    e.preventDefault();
    this.props.history.push({ pathname: "/SchoolLogin" });
  };

  // login = async (e) => {
  //   e.preventDefault();
  //   var schoolInstance;
  //   var userContractAddress = null;

  //   const self = this;
  //   web3.eth.getAccounts(function (error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }
  //     School.deployed()
  //       .then(async function (instance) {
  //         schoolInstance = instance;

  //         userContractAddress = await schoolInstance.getUserContract.call();
  //         console.log("user addresss: " + userContractAddress);
  //         console.log("account[0]" + accounts[0]);
  //         if (
  //           userContractAddress == "0x0000000000000000000000000000000000000000"
  //         ) {
  //           await schoolInstance.createUserContract(self.state.Name, {
  //             from: accounts[0],
  //           });
  //           console.log("inside await");
  //           userContractAddress = await schoolInstance.getUserContract.call();
  //           console.log("user address created: " + userContractAddress);
  //         }
  //       })
  //       .then(async function (result) {
  //         self.state.UserContractAddress = userContractAddress;
  //         self.props.history.push({
  //           pathname: "/Dashboard",
  //           state: { UserContractAddress: self.state.UserContractAddress },
  //         });
  //       })
  //       .catch(function (err) {
  //         console.log(err.message);
  //       });
  //   });
  // };

  login = async (e) => {
    e.preventDefault();
    // var UserFactory = TruffleContract(userFactoryABI.abi);
    // UserFactory.setProvider(Web3.givenProvider);

    let contractInstance = new web3.eth.Contract(
      contractAbi.abi,
      process.env.REACT_APP_CONTRACT_ADDRESS
    );

    const self = this;

    try {
      if (!window.ethereum) {
        console.log('Metamask not installed')
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log(accounts)
      let userContractAddress = await contractInstance.methods
        .getUserContract()
        .call({ from: accounts[0] });
      console.log("user addresss: " + userContractAddress);
      console.log("account[0]" + accounts[0]);
      if (userContractAddress == "0x0000000000000000000000000000000000000000") {
        console.log("New user detected");
        // Move them somewhere ?
        await contractInstance.methods
          .createUserContract(
            "Name", // Name the user just entered
            "0x365809B0E78603576e19a44f0e8325EC527CFBdA" // Address of the school contract
          )
          .send({ from: accounts[0] });
        userContractAddress = await contractInstance.methods.getUserContract.call();
        console.log(userContractAddress);
      } else {
      }
      self.state.UserContractAddress = userContractAddress;
      self.props.history.push({
        pathname: "/Dashboard",
        state: { UserContractAddress: self.state.UserContractAddress },
      });
    } catch (err) {
      console.log(err);
      console.log(err.message);
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
            Invest in both yourself and your community.
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

            <div>
              <Button
                className="Button"
                onClick={this.login}
                type="submit"
                style={{
                  backgroundColor: "#146EFF",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  borderWidth: "0px",
                }}
              >
                Log In
              </Button>
            </div>
          </Form>
          <div className="SchoolLogin">
            <Button
              className="Button"
              onClick={this.schoolLogin}
              type="submit"
              style={{
                backgroundColor: "white",
                color: "#146EFF",
                borderWidth: "0px",
              }}
            >
              I'm a school!
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
