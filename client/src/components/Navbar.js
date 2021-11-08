import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import DomainOutlinedIcon from "@material-ui/icons/DomainOutlined";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import "../App.css";

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const routes = ["/Account", "/Loans", "/Community", "/Settings"];

export default function NavBar(props) {
  return (
    <div className="NavBar">
      <MuiThemeProvider theme={theme}>
        <AppBar position="relative" style={{ background: "#ECF3FF" }}>
          <Tabs
            TabIndicatorProps={{
              style: { background: "#146EFF", height: "5px" },
            }}
            value={props.active}
            onChange={(event, value) =>
              value != props.active
                ? props.history.push({ pathname: routes[value] })
                : null
            }
            variant="fullWidth"
            textColor="primary"
          >
            <Tab
              icon={<AccountBalanceWalletOutlinedIcon />}
              label="Account"
              {...a11yProps(0)}
            />
            <Tab
              icon={<SettingsOutlinedIcon />}
              label="Borrow"
              {...a11yProps(1)}
            />
            <Tab
              icon={<DomainOutlinedIcon />}
              label="Projects"
              {...a11yProps(2)}
            />
            <Tab
              icon={<SettingsOutlinedIcon />}
              label="Settings"
              {...a11yProps(3)}
            />
          </Tabs>
        </AppBar>
      </MuiThemeProvider>
    </div>
  );
}
