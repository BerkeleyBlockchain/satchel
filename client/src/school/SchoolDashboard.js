import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import SchoolOutlinedIcon from "@material-ui/icons/SchoolOutlined";
import FolderOutlinedIcon from "@material-ui/icons/FolderOutlined";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";

import "../App.css";
import Panel from "../components/Panel";
import {
  getSchoolProjects,
  handleSchoolLogout,
  getSchoolBalance,
  withdrawSchool,
} from "../redux/actions/school_actions";

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

class SchoolDashboard extends Component {
  state = {
    Balance: "",
    Withdraw: "",
    activeTab: 0,
    withdrawLoading: false,
  };

  componentDidMount() {
    if (!this.props.address) {
      this.props.history.push({ pathname: "Login" });
    } else {
      this.props.getSchoolProjects(this.props.address);
      this.props.getSchoolBalance(this.props.address);
    }
  }

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

  createProject = async (e) => {
    console.log(this.state.schoolAdress);
    this.props.history.push({
      pathname: "/CreateProject",
      Balance: this.state.Balance,
      Withdraw: this.state.Withdraw,
      Name: this.state.Name,
      activeTab: this.state.activeTab,
      schoolAddress: this.state.schoolAddress,
    });
  };

  render() {
    console.log(this.props.projects);

    return (
      <div className="App">
        <div className="screens">
          <TabPanel value={this.state.activeTab} index={0}>
            <div className="Welcome">
              {"Welcome back, " + this.props.name + "!"}
            </div>
            <div className="Balance">
              <div className="BalanceTitle">CURRENT BALANCE</div>
              <div className="BalanceAmount">{this.props.balance + " DAI"}</div>
            </div>

            <div>
              <Form>
                <FormGroup className="SchoolWithdrawField">
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
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
                      this.props.withdrawSchool(
                        this.props.schoolAddress,
                        this.state.Withdraw
                      );
                    }}
                    type="submit"
                  >
                    Withdraw
                    <ClipLoader
                      color={"#FFFFFF"}
                      loading={this.state.withdrawLoading}
                      size={20}
                    />
                  </Button>
                </div>
              </Form>
            </div>
          </TabPanel>
          <TabPanel value={this.state.activeTab} index={1}>
            <div className="Community">{"Projects"}</div>
            <br></br>
            <Button
              onClick={this.createProject}
              type="submit"
              style={{
                backgroundColor: "#146EFF",
                fontWeight: "bold",
                color: "white",
                borderRadius: "10px",
                borderWidth: "0px",
              }}
              className="InitiativeButton"
            >
              Create Project
            </Button>
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
              onClick={(e) => {
                e.preventDefault();
                this.props.handleSchoolLogout(this.props.history);
              }}
              className="LogoutButton"
            >
              Logout
            </Button>
          </TabPanel>
        </div>
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
                  icon={<SchoolOutlinedIcon />}
                  label="School"
                  {...a11yProps(0)}
                />
                <Tab
                  icon={<FolderOutlinedIcon />}
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
    );
  }
}

const mapStateToProps = (state) => {
  const { name, address, projects, balance } = state.school;
  return { name, address, projects, balance };
};

export default connect(mapStateToProps, {
  getSchoolProjects,
  handleSchoolLogout,
  getSchoolBalance,
  withdrawSchool,
})(SchoolDashboard);
