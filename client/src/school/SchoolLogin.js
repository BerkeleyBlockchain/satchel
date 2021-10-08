import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";

import "../App.css";
import logo from "../logo.png";
import { loginSchool, deploySchool } from "../redux/actions/school_actions";
class SchoolLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }

  setName = async (e) => {
    e.preventDefault();
    const x = e.target.value;
    this.setState({ name: x });
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
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.loginSchool(this.state.name, this.props.history);
                  }}
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
                    loading={this.props.loginLoading}
                    size={20}
                  />
                </Button>

                <Button
                  className="Button"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.deploySchool(
                      this.state.name,
                      this.props.history
                    );
                  }}
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
                    loading={this.props.deployLoading}
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

const mapStateToProps = (state) => {
  const { loginLoading, deployLoading, error } = state.school;
  return { loginLoading, deployLoading, error };
};

export default connect(mapStateToProps, { loginSchool, deploySchool })(
  SchoolLogin
);
