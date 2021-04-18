import React, { Component } from 'react';
import { CardBody, CardSubtitle, TabContent, TabPane, NavLink, Container, Row, Col, ButtonGroup, Form, FormGroup, Label, Input, Table, Card, CardText, CardTitle, Button, Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import Paper from '@material-ui/core/Paper';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Web3 from 'web3';
import { erc20Abi, cTokenAbi, schoolJSON } from './abi/abis';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Panel from './Panel';
import ClipLoader from "react-spinners/ClipLoader";

import {Redirect} from 'react-router-dom';

 // note, contract address must match the address provided by Truffle after migrations
const web3 = new Web3(Web3.givenProvider);

const privateKey = '0xb8c1b5c1d81f9475fdf2e334517d29f733bdfa40682207571b12fc1142cbf329';

// Add your Ethereum wallet to the Web3 object
web3.eth.accounts.wallet.add(privateKey);
const myWalletAddress = web3.eth.accounts.wallet[0].address;

// Mainnet address of the underlying token contract. Example: Dai.
const underlyingMainnetAddress = process.env.REACT_APP_TOKEN_ADDRESS;
const underlying = new web3.eth.Contract(erc20Abi, underlyingMainnetAddress);

// Mainnet contract address and ABI for the cToken, which can be found in the
// mainnet tab on this page: https://compound.finance/docs
const cTokenAddress = process.env.REACT_APP_CTOKEN_ADDRESS;
const cToken = new web3.eth.Contract(cTokenAbi, cTokenAddress);

const fromMyWallet = {
  from: myWalletAddress,
  gasLimit: web3.utils.toHex(1000000),
  gasPrice: web3.utils.toHex(20000000000) // use ethgasstation.info (mainnet only)
};

const underlyingDecimals = 18; // Number of decimals defined in this ERC20 token's contract

var TruffleContract = require("truffle-contract");
var School = TruffleContract(schoolJSON);
School.setProvider(Web3.givenProvider);

const theme = createMuiTheme({
  palette: {
      primary: {
          main: '#146EFF'
      },
      secondary: {
        main: '#146EFF'
    }
    },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={'span'} variant={'body2'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

class SchoolDashboard extends Component {
  constructor(props) {
    super(props);
    var receivedProps = this.props.location.state;
    this.state = {
      Balance: '',
      Withdraw: '',
      Name: receivedProps.Name,
      activeTab: receivedProps.activeTab,
      projects: [], 
      schoolAddress: receivedProps.schoolAddress,
      schoolInstance: '',
      withdrawLoading: false,
    }
    this.setBalance = this.setBalance.bind(this);
    this.setWithdraw = this.setWithdraw.bind(this);
    this.toggle = this.toggle.bind(this);
    this.setSchoolInstance();
    this.setBalance();
    this.getProjects();
  }

  componentDidMount() {
    this.getProjects();
  }

  setSchoolInstance = async (e) => {
    let schoolInstance = new web3.eth.Contract(
      schoolJSON.abi,
      this.state.schoolAddress
    );
    this.schoolInstance = schoolInstance;
  }

  withdraw = async (e) => {
    const self = this;
    e.preventDefault();
    this.setState({withdrawLoading: true});
    const amount = web3.utils.toHex(this.state.Withdraw * Math.pow(10, underlyingDecimals));
    try {
      const accounts = await web3.eth.getAccounts();
      let schoolBalance = await self.schoolInstance.methods.getBalance(underlyingMainnetAddress).call();
      console.log("school balance: " +  schoolBalance / 1e18);
      console.log("withdrawing ... ");

      await self.schoolInstance.methods.withdrawBalance(schoolBalance, underlyingMainnetAddress).send({
        from: accounts[0],
        gasLimit: web3.utils.toHex(1000000),
        gasPrice: web3.utils.toHex(20000000000),
      });

      self.setBalance();
    } catch( err ) {
      console.log(err.message);
    }
    this.setState({ withdrawLoading: false })
  }

  setBalance = async (e) => {
    const self = this;
    try {
      let schoolBalance = await self.schoolInstance.methods.getBalance(underlyingMainnetAddress).call();
      console.log("schoolBalance: " + Number((schoolBalance / 1e18).toFixed(2)));
      self.setState({Balance: Number((schoolBalance / 1e18).toFixed(6))});
    } catch( err ) {
      console.log("setBalance " + err.message);
    };
  }

  setWithdraw = (event) => {
    event.preventDefault();
    const x = event.target.value;
    this.setState({Withdraw: x});
  };

  toggle = (event, tab) => {
    event.preventDefault();
    if (this.state.activeTab !== tab) {
      this.setState({activeTab: tab});
    }
  }

  createProject = async (e) => {
    console.log(this.state.Name)
    this.props.history.push({pathname: "/CreateProject", Balance: this.state.Balance, Withdraw: this.state.Withdraw, Name: this.state.Name, activeTab: this.state.activeTab});

  }

  getProjects = async() => {
    await axios.get('http://localhost:4000/api/project?schoolAddress=0xa0df350d2637096571F7A701CBc1C5fdE30dF76A')
    .then(res=>this.setState(
      {projects: res.data.projects}));
  };

  logout = (event) => {
    const self = this;
    event.preventDefault();
    self.props.history.push({pathname: "/Login", state: {}});
  };

  render() {
    console.log(this.state.projects);
    const { classes } = this.props;
    return (
      <div className="App">
        <div >
          <TabPanel value={this.state.activeTab} index={0}>
              <div className="Welcome">
                  {"Welcome back, " + this.state.Name + "!"}
              </div>
              <div className="Balance">
                <div className="BalanceTitle">
                    CURRENT BALANCE
                </div>
                <div className="BalanceAmount">
                    { this.state.Balance + " DAI"}
                </div>
              </div>

              <div>
                <Form>
                    <FormGroup className="SchoolWithdrawField">
                      <Label for="amount"></Label>
                      <Input onChange={this.setWithdraw} type="number" name="text" id="amount" placeholder="Enter amount" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}/>
                    </FormGroup>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <Button 
                    style={{
                      backgroundColor: "#146EFF",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      borderWidth: "0px",
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around'
                    }}
                    className="AmountButton"
                    onClick={this.withdraw}
                    type="submit"
                    >
                    Withdraw
                    <ClipLoader color={"#FFFFFF"} loading={this.state.withdrawLoading} size={20} />
                  </Button>
                  </div>
                </Form>
              </div>

          </TabPanel>
          <TabPanel value={this.state.activeTab} index={1}>
              <div className="Community">
                  {"Projects"}
              </div>
              <br></br>
               <Button onClick={this.createProject} type="submit" style={{ backgroundColor:"#146EFF", fontWeight: "bold", color:"white", borderRadius: "10px", borderWidth:"0px"}} className="InitiativeButton">Create Project</Button>
               {this.state.projects.length > 0? this.state.projects.map(project => (
                  <div className="PanelWidth">
                    <Panel project={project}></Panel>
                  </div>
                )): null
               }
          </TabPanel>
          <TabPanel value={this.state.activeTab} index={2}>
          <Button style={{ backgroundColor:"white", fontWeight: "bold", color:"#146EFF", borderRadius: "10px", borderWidth:"3px", borderColor: "#146EFF"}} onClick={this.logout} className="LogoutButton">Logout</Button>
          </TabPanel>

          
        </div>
        <div className="NavBar">
        <MuiThemeProvider theme={theme}>
            <AppBar position="relative" style={{background: "#ECF3FF"}}>
                <Tabs
                  TabIndicatorProps={{ style: { background: "#146EFF", height: "5px"} }}
                  value={this.state.activeTab}
                  onChange={this.toggle}
                  variant="fullWidth"
                  textColor="primary"
                >
                  <Tab icon={<SchoolOutlinedIcon />} label="School" {...a11yProps(0)} />
                  <Tab icon={<FolderOutlinedIcon />} label="Projects" {...a11yProps(1)} />
                  <Tab icon={<SettingsOutlinedIcon />} label="Settings" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

export default SchoolDashboard;
