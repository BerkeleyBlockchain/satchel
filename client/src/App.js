import React, { Component } from "react";
import "./App.css";
import Account from "./user/Account";
import Login from "./user/Login";
import SchoolLogin from "./school/SchoolLogin";
import SchoolDashboard from "./school/SchoolDashboard";
import CreateProject from "./school/CreateProject";
import SelectSchool from "./user/SelectSchool";
import Assets from "./user/Assets";
import Settings from "./user/Settings";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Loans from "./user/Loans";
import Community from "./user/Community";
import LoanDetail from "./user/LoanDetail";
import RepayLoan from "./user/RepayLoan";
import ConfirmRepay from "./user/ConfirmRepay";
import RepayComplete from "./user/RepayComplete";
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
              path="/Account"
              render={(props) => <Account {...props} />}
            />
            <Route exact path="/Settings" component={Settings} />
            <Route exact path="/Loans" component={Loans} />
            <Route exact path="/LoanDetail" component={LoanDetail} />
            <Route exact path="/RepayLoan" component={RepayLoan} />
            <Route exact path="/ConfirmRepay" component={ConfirmRepay} />
            <Route exact path="/RepayComplete" component={RepayComplete} />
            <Route exact path="/Community" component={Community} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
