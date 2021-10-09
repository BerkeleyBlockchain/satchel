import React, { Component } from "react";
import "./App.css";
import Dashboard from "./user/Dashboard";
import Login from "./user/Login";
import SchoolLogin from "./school/SchoolLogin";
import SchoolDashboard from "./school/SchoolDashboard";
import CreateProject from "./school/CreateProject";
import SelectSchool from "./user/SelectSchool";
import Assets from "./user/Assets";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <Redirect to="/Login" />
            </Route>
            <Route exact path="/Login" component={Login} />
            <Route exact path="/SchoolLogin" component={SchoolLogin} />
            <Route exact path="/SchoolDashboard" component={SchoolDashboard} />
            <Route exact path="/CreateProject" component={CreateProject} />
            <Route exact path="/SelectSchool" component={SelectSchool} />
            <Route exact path="/Assets" component={Assets} />

            {/* <Redirect to="/CreateProject/" /> */}
            <Route
              exact
              path="/Dashboard"
              render={(props) => <Dashboard {...props} />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
