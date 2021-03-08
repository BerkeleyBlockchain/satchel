import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';



const theme = createMuiTheme({
  palette: {
      primary: {
          main: '#146EFF'
      },
      secondary: {
        main: '#146EFF'
    }
    },
});

export default function SchoolNavBar(props) {
  const [value, setValue] = React.useState(props.activeTab);

  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
      history.push({
        pathname: '/SchoolDashboard',
        state: {
          Name: props.Name,
          Withdraw: props.Withdraw,
          Balance: props.Balance,
          activeTab: newValue,
        },
      }); 
  };

  return (
    <MuiThemeProvider theme={theme}>
    <Paper position="static" style={{background: "#ECF3FF"}}>
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{ style: { background: "#146EFF", height: "5px"} }}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="icon label tabs example"
      >
        <Tab icon={< SchoolOutlinedIcon/>} label="SCHOOL" />
        <Tab icon={<FolderOutlinedIcon/>} label="PROJECTS" />
        <Tab icon={<SettingsOutlinedIcon/>} label="SETTINGS" />
      </Tabs>
    </Paper>
    </MuiThemeProvider>
  );
}

