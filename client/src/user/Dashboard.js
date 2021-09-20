import React, { Component } from "react";
import axios from "axios";
import Web3 from "web3";
import { connect } from "react-redux";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import DomainOutlinedIcon from "@material-ui/icons/DomainOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import SupervisedUserCircleOutlinedIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

import "../App.css";
import { erc20Abi, cTokenAbi } from "../abi/abis";
import userAbi from "../abi/User.json";
import schoolAbi from "../abi/School.json";
import Panel from "../components/Panel";
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
  // TBH this should all go in component did mount..
  constructor(props) {
    super(props);
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
      SchoolContract: "",
      SchoolName: "",
      SchoolAddress: "",
      projects: [],
      withdrawLoading: false,
      depositLoading: false,
    };

    this.state.UserContract = new web3.eth.Contract(
      userAbi.abi,
      this.props.contractAddress
    );
  }

  componentDidMount() {
    if (!this.props.contractAddress) {
      this.props.history.push({ pathname: "Login" });
    } else {
      this.props.getName(this.props.contractAddress);
      this.props.getBalance(this.props.contractAddress);
      this.props.getInterestRate(this.props.contractAddress);
      this.props.getContribution(this.props.contractAddress);
      this.props.getSchoolByUser(this.props.contractAddress);
    }
  }

  deposit = async (e) => {
    console.log(process.env.REACT_APP_CTOKEN_ADDRESS);
    console.log("handleGet\n");
    e.preventDefault();
    console.log(this.props.userContract);
    this.setState({ depositLoading: true });
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
    this.setState({ depositLoading: false });
  };

  withdraw = async (e) => {};

  setBalance = async (e) => {
    //
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
  };

  render() {
    console.log("User Address: ", this.props.contractAddress);
    return (
      <div className="App">
        <div className="screens">
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
              {"Welcome back, " + this.props.name + "!"}
            </div>
            <div className="Balance">
              <div className="BalanceTitle">CURRENT BALANCE</div>
              <div className="BalanceAmount">{this.props.balance + " DAI"}</div>
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
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                          className="AmountButton"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.deposit(
                              this.props.contractAddress,
                              this.state.Deposit
                            );
                          }}
                          type="submit"
                        >
                          Deposit
                          <ClipLoader
                            color={"#FFFFFF"}
                            loading={this.props.depositLoading}
                            size={20}
                          />
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
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                          className="AmountButton"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.withdraw(
                              this.props.contractAddress,
                              this.state.Withdraw
                            );
                          }}
                          type="submit"
                        >
                          Withdraw
                          <ClipLoader
                            color={"#FFFFFF"}
                            loading={this.props.withdrawLoading}
                            size={20}
                          />
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
                      {this.props.interestRate + "%"}
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
                      {Number(this.props.contribution) + " DAI"}
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
                    <div className="SchoolValue">{this.props.schoolName}</div>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="Initiative">Explore School Initiatives</div>

            {this.props.projects.length > 0
              ? this.props.projects.map((project) => (
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
              onClick={() => this.props.handleUserLogout(this.props.history)}
              className="LogoutButton"
            >
              Logout
            </Button>
          </TabPanel>

          <div className="NavBar">
            <MuiThemeProvider theme={theme}>
              <AppBar position="relative" style={{ background: "#ECF3FF" }}>
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
                    label="School"
                    {...a11yProps(0)}
                  />
                  <Tab
                    icon={<DomainOutlinedIcon />}
                    label="Projects"
                    {...a11yProps(1)}
                  />
                  <Tab
                    icon={<SettingsOutlinedIcon />}
                    label="Settings"
                    {...a11yProps(2)}
                  />
                </Tabs>
              </AppBar>
            </MuiThemeProvider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    address,
    contractAddress,
    name,
    balance,
    contribution,
    interestRate,
    depositLoading,
    withdrawLoading,
  } = state.user;
  const { projects } = state.school;
  return {
    address,
    contractAddress,
    name,
    balance,
    projects,
    contribution,
    interestRate,
    depositLoading,
    withdrawLoading,
    schoolName: state.school.name,
    schoolAddress: state.school.address,
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
})(Dashboard);
