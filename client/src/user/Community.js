import React, { Component } from "react";
import { connect } from "react-redux";
import "../App.css";
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
import DomainOutlinedIcon from "@material-ui/icons/DomainOutlined";
import SupervisedUserCircleOutlinedIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import "../App.css";
import Panel from "../components/Panel";
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

class Community extends Component {
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
      this.props.getSchoolByUser(this.props.contractAddress);
    }
  }
  render() {
    return (
      <div className="App">
        <div className="screens">
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

          <NavBar active={2} history={this.props.history} />
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
})(Community);
