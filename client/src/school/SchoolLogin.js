import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Web3 from "web3";
import { userAbi, erc20Abi, schoolAbi, schoolJSON } from "../abi/abis";
import "../App.css";
import logo from "../logo.png";
import contractAbi from "../abi/UnicefSatchel.json";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

// note, contract address must match the address provided by Truffle after migrations
const web3 = new Web3(Web3.givenProvider);

// const privateKey = '0xb8c1b5c1d81f9475fdf2e334517d29f733bdfa40682207571b12fc1142cbf329';
const privateKey =
  "0x63c532aa122a9ba3fdba7c57c10185c45db04b481a9ced93100d2fc6efea104e";
// Add your Ethereum wallet to the Web3 object
web3.eth.accounts.wallet.add(privateKey);
const myWalletAddress = web3.eth.accounts.wallet[0].address;

const fromMyWallet = {
  from: myWalletAddress,
  gasLimit: web3.utils.toHex(1000000),
  gasPrice: web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
};

var TruffleContract = require("truffle-contract");
var School = TruffleContract(schoolJSON);
School.setProvider(Web3.givenProvider);

class SchoolLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      activeTab: 0,
      loginLoading: false,
      createLoading: false,
    };
    this.setName = this.setName.bind(this);
    this.login = this.login.bind(this);
  }

  setName = async (e) => {
    e.preventDefault();
    const x = e.target.value;
    this.setState({ Name: x });
  };

  deploySchool = async (e) => {
    e.preventDefault();
    // var UserFactory = TruffleContract(userFactoryABI.abi);
    // UserFactory.setProvider(Web3.givenProvider);

    let contractInstance = new web3.eth.Contract(
      contractAbi.abi,
      process.env.REACT_APP_CONTRACT_ADDRESS
    );
    this.setState({ createLoading: true });

    try {
      const accounts = await web3.eth.getAccounts();
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await contractInstance.methods
        .newSchool(this.state.Name)
        .estimateGas({ from: accounts[0] });

      // contract.methods
      //   .mySchool()
      // .myMethod()
      // .send({ from: account, gasPrice: gasPrice, gas: gasEstimate });
      const { events } = await contractInstance.methods
        .newSchool(this.state.Name)
        .send({ from: accounts[0], gasPrice: gasPrice, gas: gasEstimate });
      const id = events.newSchoolEvent.returnValues.schoolId;
      console.log(this.state.Name + " created");
      console.log(id);
      const schoolAddress = await contractInstance.methods
        .schoolArray(id)
        .call();
      console.log(schoolAddress); // Gives address of school contract

      await axios.post("http://localhost:4000/api/school/createSchool", {
        name: this.state.Name,
        address: schoolAddress,
      });

      this.props.history.push({
        pathname: "/SchoolDashboard",
        state: {
          Name: this.state.Name,
          activeTab: this.state.activeTab,
          schoolAddress: schoolAddress,
        },
      });
    } catch (err) {
      console.log(err);
      console.log(err.message);
    }
    this.setState({ createLoading: false });
  };

  login = async (e) => {
    e.preventDefault();
    this.setState({ loginLoading: true });

    let contractInstance = new web3.eth.Contract(
      contractAbi.abi,
      process.env.REACT_APP_CONTRACT_ADDRESS
    );

    try {
      if (!window.ethereum) {
        console.log("Metamask not installed");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      console.log(accounts);
      let ownedSchoolIds = await contractInstance.methods
        .getSchoolByOwner(account)
        .call();
      console.log(ownedSchoolIds);
      let ownedSchoolNames = await Promise.all(
        ownedSchoolIds.map(
          async (id) => await contractInstance.methods.getSchoolName(id).call()
        )
      );
      console.log(ownedSchoolNames);
      if (!ownedSchoolNames.includes(this.state.Name)) {
        console.log("No school found");
        this.setState({ loginLoading: false });
        return;
      }

      let id = ownedSchoolNames.indexOf(this.state.Name);
      let schoolAddress = await contractInstance.methods.schoolArray(id).call();
      console.log(schoolAddress);
      this.props.history.push({
        pathname: "/SchoolDashboard",
        state: {
          Name: this.state.Name,
          activeTab: this.state.activeTab,
          schoolAddress: schoolAddress,
        },
      });
    } catch (e) {
      console.log(e);
    }
    this.setState({ loginLoading: false });
  };

  render() {
    return (
      <div className="App">
        <div className="LoginItems">
          <div>
            {" "}
            <img src={logo} alt="Logo" height={35} width={35} />{" "}
          </div>

          <div className="LoginWelcome">{"School Portal"}</div>

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
                placeholder="Enter school name"
                style={{
                  backgroundColor: "#ECF3FF",
                  color: "black",
                  borderRadius: "10px",
                  border: "white",
                  fontSize: "15px",
                }}
              />
            </FormGroup>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <>
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
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Log In{" "}
                  <ClipLoader
                    color={"#FFFFFF"}
                    loading={this.state.loginLoading}
                    size={20}
                  />
                </Button>

                <Button
                  className="Button"
                  onClick={this.deploySchool}
                  type="submit"
                  style={{
                    backgroundColor: "#146EFF",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    borderWidth: "0px",
                    marginTop: "5%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Create New School
                  <ClipLoader
                    color={"#FFFFFF"}
                    loading={this.state.createLoading}
                    size={20}
                  />
                </Button>
              </>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default SchoolLogin;
