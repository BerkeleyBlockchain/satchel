import React, { Component } from "react";
import {
  CardBody,
  CardSubtitle,
  TabContent,
  TabPane,
  NavLink,
  Container,
  Row,
  Col,
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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Web3 from "web3";
import { erc20Abi, cTokenAbi } from "./abi/abis";
import userAbi from "./abi/User.json";
import schoolAbi from "./abi/School.json";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import DomainOutlinedIcon from "@material-ui/icons/DomainOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import SupervisedUserCircleOutlinedIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import MenuBookOutlinedIcon from "@material-ui/icons/MenuBookOutlined";
import FastfoodOutlinedIcon from "@material-ui/icons/FastfoodOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import axios from "axios";
import Panel from "./Panel";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

// note, contract address must match the address provided by Truffle after migrations
const web3 = new Web3(Web3.givenProvider);

// const privateKey =
//   "0xb8c1b5c1d81f9475fdf2e334517d29f733bdfa40682207571b12fc1142cbf329";

// Add your Ethereum wallet to the Web3 object
// web3.eth.accounts.wallet.add(privateKey);
// const myWalletAddress = web3.eth.accounts.wallet[0].address;

// Mainnet address of the underlying token contract. Example: Dai.
const underlyingMainnetAddress = process.env.REACT_APP_TOKEN_ADDRESS;
const underlying = new web3.eth.Contract(erc20Abi, underlyingMainnetAddress);

// Mainnet contract address and ABI for the cToken, which can be found in the
// mainnet tab on this page: https://compound.finance/docs
const cTokenAddress = process.env.REACT_APP_CTOKEN_ADDRESS;
const cToken = new web3.eth.Contract(cTokenAbi, cTokenAddress);

// const fromMyWallet = {
//   from: "0x00000000000",
//   gasLimit: web3.utils.toHex(1000000),
//   gasPrice: web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
// };

const underlyingDecimals = 18; // Number of decimals defined in this ERC20 token's contract

// var TruffleContract = require("truffle-contract");
// var School = TruffleContract(schoolAbi.abi);
// School.setProvider(Web3.givenProvider);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#146EFF",
    },
    secondary: {
      main: "#146EFF",
    },
  },
});

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

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
          <Typography component={"span"} variant={"body2"}>
            {children}
          </Typography>
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    var receivedProps = this.props.location.state;
    this.state = {
      activeTab: 0,
      Balance: "",
      Deposit: "",
      Withdraw: "",
      InterestRate: "",
      Contribution: "",
      RoundedContribution: "",
      School: "",
      Name: "",
      UserContractAddress: receivedProps.UserContractAddress,
      UserContract: "",
      SchoolContract: "",
      SchoolName: "",
      SchoolAddress: "",
      projects: [],
      withdrawLoading: false,
      depositLoading: false,
    };
    this.setBalance = this.setBalance.bind(this);
    this.setDeposit = this.setDeposit.bind(this);
    this.setWithdraw = this.setWithdraw.bind(this);
    this.setInterestRate = this.setInterestRate.bind(this);
    this.setContribution = this.setContribution.bind(this);
    this.toggle = this.toggle.bind(this);
    this.setName = this.setName.bind(this);
    this.state.UserContract = new web3.eth.Contract(
      userAbi.abi,
      this.state.UserContractAddress
    );

    this.setBalance();
    this.setInterestRate();
    this.setContribution();
    this.setName();
    this.setSchoolContract();
  }

  deposit = async (e) => {
    console.log(process.env.REACT_APP_CTOKEN_ADDRESS);
    console.log("handleGet\n");
    e.preventDefault();
    console.log(this.state.UserContractAddress);
    this.setState({ depositLoading: true })
    const accounts = await web3.eth.getAccounts();

    try {
      let transferResult = await underlying.methods
        .transfer(
          this.state.UserContractAddress,
          web3.utils.toHex(
            this.state.Deposit * Math.pow(10, underlyingDecimals)
          ) // 10 tokens to send to MyContract
        )
        .send({
          from: accounts[0],
          gasLimit: web3.utils.toHex(1000000),
          gasPrice: web3.utils.toHex(20000000000),
        });
      console.log("transfer result");
      let supplyResult = await this.state.UserContract.methods
        .deposit(
          underlyingMainnetAddress,
          cTokenAddress,
          web3.utils.toHex(
            this.state.Deposit * Math.pow(10, underlyingDecimals)
          ) // 10 tokens to supply
        )
        .send({
          from: accounts[0],
          gasLimit: web3.utils.toHex(1000000),
          gasPrice: web3.utils.toHex(20000000000),
        });
      console.log("supply result");

      this.setBalance();
      // this.setInterestRate();
    } catch (e) {
      console.log(e);
    }
    this.setState({ depositLoading: false })
  };

  withdraw = async (e) => {
    e.preventDefault();
    this.setState({ withdrawLoading: true })
    try {
      const amount = web3.utils.toHex(
        this.state.Withdraw * Math.pow(10, underlyingDecimals)
      );

      const accounts = await web3.eth.getAccounts();

      console.log(`Redeeming ...`);
      let redeemResult = await this.state.UserContract.methods
        .withdraw(amount, underlyingMainnetAddress, cTokenAddress)
        .send({
          from: accounts[0],
          gasLimit: web3.utils.toHex(1000000),
          gasPrice: web3.utils.toHex(20000000000),
        });

      console.log(redeemResult.events.MyLog);
      this.setBalance();
      // this.setInterestRate();
    } catch (e) {
      console.log(e);
    }
    this.setState({ withdrawLoading: false })
  };

  setContribution = async (e) => {
    let x =
      (await this.state.UserContract.methods.getContribution().call()) / 1e18;
    this.setState({ Contribution: x });
    this.setState({ RoundedContribution: Number(x.toFixed(6)) });
  };

  setBalance = async (e) => {
    let cTokenBalance = await cToken.methods
      .balanceOf(this.state.UserContractAddress)
      .call();
    cTokenBalance = cTokenBalance / 1e8;
    console.log(`MyContract's Token Balance:`, cTokenBalance);
    let balance =
      (await this.state.UserContract.methods.getBalance(cTokenAddress).call()) /
      1e18 /
      1e18;
    console.log(balance);
    this.setState({ Balance: Number(balance.toFixed(2)) });
    this.setState({ withdrawLoading: false })
  };

  setInterestRate = async () => {
    await axios
      .get(
        "https://api.compound.finance/api/v2/ctoken?addresses=0x5d3a536e4d6dbd6114cc1ead35777bab948e3643"
      )
      .then((res) =>
        this.setState({
          InterestRate: Number(
            ((res.data.cToken[0].supply_rate.value / 2) * 100).toFixed(2)
          ),
        })
      );
  };

  setName = async () => {
    console.log("Getting Name");
    let x = await this.state.UserContract.methods.getName().call();
    console.log("Name is " + x); 
    this.setState({ Name: x });
  };

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
    this.setContribution();
  };

  setSchoolContract = async (e) => {
    try {
      console.log("Setting School");
      let schoolAddress = await this.state.UserContract.methods
        .schoolContract()
        .call();
      console.log("School address is ", schoolAddress)
      console.log(schoolAddress);
      const schoolContract = new web3.eth.Contract(
        schoolAbi.abi,
        schoolAddress
      );
      const name = await schoolContract.methods.getName().call();
      console.log(name);
      console.log(schoolAddress);
      this.setState({
        SchoolContract: schoolContract,
        SchoolName: name,
        SchoolAddress: schoolAddress,
      });
    } catch (e) {
      console.log(e);
    }
    this.getProjects();
  };

  // componentDidMount() {
  //   this.getProjects();
  // }

  getProjects = async () => {
    console.log("hi", this.state.SchoolAddress);
    await axios
      .get(
        "http://localhost:4000/api/project?schoolAddress=" + this.state.SchoolAddress
      )
      .then((res) => this.setState({ projects: res.data.projects }));
  };

  logout = (event) => {
    const self = this;
    event.preventDefault();
    self.props.history.push({ pathname: "/Login", state: {} });
  };

  render() {
    const { classes } = this.props;
    console.log("User Address: ", this.state.UserContractAddress);
    return (
      <div className="App">
        <div>
          {/* <MuiThemeProvider theme={theme}>
            <AppBar position="static" style={{ background: "#ECF3FF" }}>
              <Tabs
                TabIndicatorProps={{
                  style: { background: "#146EFF", height: "5px" },
                }}
                value={this.state.activeTab}
                onChange={this.toggle}
                variant="fullWidth"
                textColor="primary"
              >
                <Tab
                  icon={<AccountBalanceWalletOutlinedIcon />}
                  label="Account"
                  {...a11yProps(0)}
                />
                <Tab
                  icon={<DomainOutlinedIcon />}
                  label="Community"
                  {...a11yProps(1)}
                />
                <Tab
                  icon={<SettingsOutlinedIcon />}
                  label="Settings"
                  {...a11yProps(2)}
                />
              </Tabs>
            </AppBar>
          </MuiThemeProvider> */}

          <TabPanel value={this.state.activeTab} index={0}>
            <div className="Welcome">
              {"Welcome back, " + this.state.Name + "!"}
            </div>
            <div className="Balance">
              <div className="BalanceTitle">CURRENT BALANCE</div>
              <div className="BalanceAmount">{this.state.Balance + " DAI"}</div>
            </div>

            <div className="ColAlign">
              <Container>
                <Row>
                  <Col xs="6">
                    <Form>
                      <Row>
                        <FormGroup className="AmountField">
                          <Label for="amount"></Label>
                          <Input
                            onChange={this.setDeposit}
                            type="number"
                            name="text"
                            id="amount"
                            placeholder="Enter amount"
                            style={{
                              backgroundColor: "#ECF3FF",
                              color: "black",
                              borderRadius: "10px",
                              border: "white",
                              fontSize: "12px",
                            }}
                          />
                        </FormGroup>
                      </Row>
                      <Row>
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
                          onClick={this.deposit}
                          type="submit"
                        >
                          Deposit
                          <ClipLoader color={"#FFFFFF"} loading={this.state.depositLoading} size={20} />
                        </Button>
                      </Row>
                    </Form>
                  </Col>
                  <Col xs="6">
                    <Form>
                      <Row>
                        <FormGroup className="AmountField">
                          <Label for="amount"></Label>
                          <Input
                            onChange={this.setWithdraw}
                            type="number"
                            name="text"
                            id="amount"
                            placeholder="Enter amount"
                            style={{
                              backgroundColor: "#ECF3FF",
                              color: "black",
                              borderRadius: "10px",
                              border: "white",
                              fontSize: "12px",
                            }}
                          />
                        </FormGroup>
                      </Row>
                      <Row>
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
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </div>

            <div className="InterestRate">
              <Container>
                <Row>
                  <Col xs="8">
                    <div className="InterestTitle">Interest Rate</div>
                  </Col>
                  <Col xs="4">
                    <div className="InterestAmount">
                      {this.state.InterestRate + "%"}
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </TabPanel>
          <TabPanel value={this.state.activeTab} index={1}>
            <div className="Community">{"Community"}</div>
            <div className="Contributions">
              <Container>
                <Row>
                  <Col xs="2">
                    <SupervisedUserCircleOutlinedIcon
                      style={{ color: "#146EFF", fontSize: "30px" }}
                      className="CommunityIcon"
                    />
                  </Col>
                  <Col xs="10">
                    <div className="ContributionsTitle">
                      {"Your Contributions"}
                    </div>
                    <div className="ContributionsAmount">
                      {this.state.RoundedContribution + " DAI"}
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>

            <div className="School">
              <Container>
                <Row>
                  <Col xs="2">
                    <DomainOutlinedIcon
                      style={{ color: "#146EFF", fontSize: "30px" }}
                      className="CommunityIcon"
                    />
                  </Col>
                  <Col xs="10">
                    <div className="SchoolTitle">{"Your School"}</div>
                    <div className="SchoolValue">{this.state.SchoolName}</div>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="Initiative">Explore School Initiatives</div>

            {this.state.projects.length > 0
              ? this.state.projects.map((project) => (
                  <div className="PanelWidth">
                    <Panel project={project}></Panel>
                  </div>
                ))
              : null}
          </TabPanel>
          <TabPanel value={this.state.activeTab} index={2}>
            <Button
              style={{
                backgroundColor: "white",
                fontWeight: "bold",
                color: "#146EFF",
                borderRadius: "10px",
                borderWidth: "3px",
                borderColor: "#146EFF",
              }}
              onClick={this.logout}
              className="LogoutButton"
            >
              Logout
            </Button>
          </TabPanel>

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
                  <Tab icon={<AccountBalanceWalletOutlinedIcon />} label="School" {...a11yProps(0)} />
                  <Tab icon={<DomainOutlinedIcon />} label="Projects" {...a11yProps(1)} />
                  <Tab icon={<SettingsOutlinedIcon />} label="Settings" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
          </MuiThemeProvider>
        </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
