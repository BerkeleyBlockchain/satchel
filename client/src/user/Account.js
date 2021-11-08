import React, { Component } from "react";
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ClipLoader from "react-spinners/ClipLoader";
import "../App.css";
import assets from "../assets.json";

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
import NavBar from "../components/Navbar";

class Account extends Component {
  state = {
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
    dropdownOpen: false,
    dropDownValue: "Select Asset",
    activeAsset: {},
  };

  async componentDidMount() {
    if (!this.props.contractAddress) {
      this.props.history.push({ pathname: "Login" });
    } else {
      this.props.getName(this.props.contractAddress);
      this.props.getBalance(this.props.contractAddress);
      // this.props.getInterestRate(this.props.contractAddress);
      // this.props.getContribution(this.props.contractAddress);
      this.props.getSchoolByUser(this.props.contractAddress);
    }
  }

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

  toggleAsset = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  render() {
    console.log("User Address: ", this.props.contractAddress);
    return (
      <div className="App">
        <div className="screens">
          <div className="Welcome">
            {"Welcome back, " + this.props.name + "!"}
          </div>
          <div
            className="Balance"
            onClick={() => this.props.history.push({ pathname: "/Assets" })}
          >
            <div className="BalanceTitle">CURRENT BALANCE</div>
            <div className="BalanceAmount">
              {this.props.totalBalance + " USD"}
            </div>
          </div>

          <div className="ColAlign">
            <Container>
              <Dropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggleAsset}
              >
                <DropdownToggle className="my-dropdown" my-dropdown caret>
                  {!this.state.activeAsset.name
                    ? "Select Asset"
                    : "Asset: " + this.state.activeAsset.name}
                </DropdownToggle>
                <DropdownMenu>
                  {assets.map((asset) => (
                    <DropdownItem
                      onClick={() => this.setState({ activeAsset: asset })}
                    >
                      {asset.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

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
                            this.state.Deposit,
                            this.state.activeAsset
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
                            this.state.Withdraw,
                            this.state.activeAsset
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
          <NavBar active={0} history={this.props.history} />
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
    totalBalance,
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
    totalBalance,
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
})(Account);
