import React, { Component } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Login from "./Login";
import SchoolLogin from "./SchoolLogin";
import SchoolDashboard from "./SchoolDashboard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path = "/Login" component = {Login}/>
            <Route exact path = "/SchoolLogin" component = {SchoolLogin}/>
            <Route exact path = "/SchoolDashboard" component = {SchoolDashboard}/>
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
