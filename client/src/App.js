import React, { Component } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Login from "./Login";
import SchoolLogin from "./SchoolLogin";
import SchoolDashboard from "./SchoolDashboard";
import CreateProject from "./CreateProject";
import SelectSchool from "./SelectSchool";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
                <Redirect to="/Login" />
            </Route>
            <Route exact path = "/Login" component = {Login}/>
            <Route exact path = "/SchoolLogin" component = {SchoolLogin}/>
            <Route exact path = "/SchoolDashboard" component = {SchoolDashboard}/>
            <Route exact path = "/CreateProject" component = {CreateProject}/>
            <Route exact path = "/SelectSchool" component = {SelectSchool}/>
            {/* <Redirect to="/CreateProject/" /> */}
            <Route
              exact path="/Dashboard"
              render={(props) => <Dashboard {...props} />}
            />
          </Switch>
        </div>
      </Router>

    )
  }
}

export default App;
