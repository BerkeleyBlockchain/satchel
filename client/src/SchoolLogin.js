import React, { Component } from 'react';
import { ButtonGroup, Form, FormGroup, Label, Input, Table, Card, CardText, CardTitle, Button, Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import Web3 from 'web3';
import { userAbi, erc20Abi, schoolAbi, schoolJSON } from './abi/abis';
import './App.css';
import BusinessCenterOutlinedIcon from '@material-ui/icons/BusinessCenterOutlined';
import logo from './logo.png';

// note, contract address must match the address provided by Truffle after migrations
const web3 = new Web3(Web3.givenProvider);

const privateKey = '0xb8c1b5c1d81f9475fdf2e334517d29f733bdfa40682207571b12fc1142cbf329';

// Add your Ethereum wallet to the Web3 object
web3.eth.accounts.wallet.add(privateKey);
const myWalletAddress = web3.eth.accounts.wallet[0].address;

const fromMyWallet = {
  from: myWalletAddress,
  gasLimit: web3.utils.toHex(1000000),
  gasPrice: web3.utils.toHex(20000000000) // use ethgasstation.info (mainnet only)
};


var TruffleContract = require("truffle-contract");
var School = TruffleContract(schoolJSON);
School.setProvider(Web3.givenProvider);


class SchoolLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
          Name: '',
          activeTab: 0
        }
        this.setName = this.setName.bind(this);
        this.login = this.login.bind(this);
    }

    setName = async (e) => {
        e.preventDefault();
        const x = e.target.value;
        this.setState({Name: x});
    }

    login = async (e) => {
        e.preventDefault();
        this.props.history.push({pathname: "/SchoolDashboard", state: {Name: this.state.Name, activeTab: this.state.activeTab}});

    }

    render() {
        return (
          <div className="App">
            <div className="LoginItems">
                    <div> <img src={logo} alt="Logo" height={35} width={35}/> </div>

                  <div className="LoginWelcome">
                    {"School Portal"}
                  </div>

                  <div className="Slogan">
                      Invest in both yourself and your community.
                    </div>

                  <Form>
                    <FormGroup className="NameField">
                      <Label for="amount"></Label>
                      <Input onChange={this.setName} type="text" name="text" id="amount" placeholder="Enter school name" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "15px"}} />
                    </FormGroup>

                    <div>
                      <Button className="Button" onClick={this.login} type="submit" style={{ backgroundColor:"#146EFF", color:"white", fontWeight:"bold", borderRadius: "10px", borderWidth:"0px"}}>Log In</Button>
                    </div>
                  </Form>
              </div>
          </div>
        );
      }
}

  export default SchoolLogin;
