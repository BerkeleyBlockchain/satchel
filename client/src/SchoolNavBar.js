import React, { Component } from 'react';
import { CardBody, CardSubtitle, TabContent, TabPane, NavLink, Container, Row, Col, ButtonGroup, Form, FormGroup, Label, Input, Table, Card, CardText, CardTitle, Button, Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import Paper from '@material-ui/core/Paper';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Web3 from 'web3';
import { erc20Abi, cTokenAbi, schoolJSON } from './abi/abis';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import MenuBookOutlinedIcon from '@material-ui/icons/MenuBookOutlined';
import FastfoodOutlinedIcon from '@material-ui/icons/FastfoodOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import LocationCityOutlinedIcon from '@material-ui/icons/LocationCityOutlined';
import KitchenOutlinedIcon from '@material-ui/icons/KitchenOutlined';

function Navbar(props) {
    const [current, setcurrent] = useState('mail');
    const history = useHistory();
    const toHistory = () => history.push('/history');
    const toTransactions = () => history.push('/status')
    function handleclick(e) {
        console.log('click', e);
        setcurrent({ current: e.key });
    }
    {/*NavBar different for diff pages
    props.page = "man" -> return navigation bar for manufacturer page
    if you do not set props.page when you vall NavBar then you will get the default home
    */}
    return (
        <div className="App">
        <div >

        <MuiThemeProvider theme={theme}>
            <AppBar position="static" style={{background: "#ECF3FF"}}>
                <Tabs
                  TabIndicatorProps={{ style: { background: "#146EFF", height: "5px"} }}
                  value={this.state.activeTab}
                  onChange={this.toggle}
                  variant="fullWidth"
                  textColor="primary"
                >
                  <Tab icon={<SchoolOutlinedIcon />} label="School" {...a11yProps(0)} />
                  <Tab icon={<FolderOutlinedIcon />} label="Projects" {...a11yProps(1)} />
                  <Tab icon={<SettingsOutlinedIcon />} label="Settings" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
          </MuiThemeProvider>

          <TabPanel value={this.state.activeTab} index={0}>
              <div className="Welcome">
                  {"Welcome back, " + this.state.Name + "!"}
              </div>
              <div className="Balance">
                <div className="BalanceTitle">
                    CURRENT BALANCE
                </div>
                <div className="BalanceAmount">
                    { this.state.Balance + " DAI"}
                </div>
              </div>

              <div>
                <Form>
                    <FormGroup className="SchoolWithdrawField">
                      <Label for="amount"></Label>
                      <Input onChange={this.setWithdraw} type="number" name="text" id="amount" placeholder="Enter amount" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}/>
                    </FormGroup>
                  <Button style={{ backgroundColor:"#146EFF", color: "white", fontWeight:"bold", borderRadius: "10px", borderWidth:"0px"}} className="AmountButton" onClick={this.withdraw} type="submit">Withdraw</Button>
                </Form>
              </div>

          </TabPanel>
          <TabPanel value={this.state.activeTab} index={1}>
              <div className="Community">
                  {"Projects"}
              </div>
              <br></br>
               <Button onClick={this.createProject} type="submit" style={{ backgroundColor:"#146EFF", fontWeight: "bold", color:"white", borderRadius: "10px", borderWidth:"0px"}} className="InitiativeButton">Create Project</Button>
                <div className="InitiativeSection">
                <Container>
                    <Row>
                      <Col xs="2" >
                          <MenuBookOutlinedIcon style={{ color:"#146EFF", fontSize:"30px"}} className="CommunityIcon"/>
                      </Col>
                      <Col xs="8">
                        <div className = "InitiativeTitle">{"School Textbooks"}</div>
                        <div className = "InitiativeDescription">{"These will be some very good books."}</div>
                      </Col>
                      <Col xs="1" >
                          <ArrowForwardIosOutlinedIcon style={{ color:"black", fontSize:"20px"}} className="CommunityIcon"/>
                      </Col>
                    </Row>
                  </Container>
                </div>

                <div className="InitiativeSection">
                <Container>
                    <Row>
                      <Col xs="2" >
                          <FastfoodOutlinedIcon style={{ color:"#146EFF", fontSize:"30px"}} className="CommunityIcon"/>
                      </Col>
                      <Col xs="8">
                        <div className = "InitiativeTitle">{"Lunch Options"}</div>
                        <div className = "InitiativeDescription">{"Improving nutrition for students."}</div>
                      </Col>
                      <Col xs="1" >
                          <ArrowForwardIosOutlinedIcon style={{ color:"black", fontSize:"20px"}} className="CommunityIcon"/>
                      </Col>
                    </Row>
                  </Container>
                </div>

                <div className="InitiativeSection">
                <Container>
                    <Row>
                      <Col xs="2" >
                          <LocationCityOutlinedIcon style={{ color:"#146EFF", fontSize:"30px"}} className="CommunityIcon"/>
                      </Col>
                      <Col xs="8">
                        <div className = "InitiativeTitle">{"Building Renovation"}</div>
                        <div className = "InitiativeDescription">{"Removing old buildings and adding new ones."}</div>
                      </Col>
                      <Col xs="1" >
                          <ArrowForwardIosOutlinedIcon style={{ color:"black", fontSize:"20px"}} className="CommunityIcon"/>
                      </Col>
                    </Row>
                  </Container>
                </div>

                <div className="InitiativeSection">
                <Container>
                    <Row>
                      <Col xs="2" >
                          <KitchenOutlinedIcon style={{ color:"#146EFF", fontSize:"30px"}} className="CommunityIcon"/>
                      </Col>
                      <Col xs="8">
                        <div className = "InitiativeTitle">{"Food Drive"}</div>
                        <div className = "InitiativeDescription">{"Hosting a winter-season food drive."}</div>
                      </Col>
                      <Col xs="1" >
                          <ArrowForwardIosOutlinedIcon style={{ color:"black", fontSize:"20px"}} className="CommunityIcon"/>
                      </Col>
                    </Row>
                  </Container>
                </div>

          </TabPanel>
          <TabPanel value={this.state.activeTab} index={2}>
          <Button style={{ backgroundColor:"white", fontWeight: "bold", color:"#146EFF", borderRadius: "10px", borderWidth:"3px", borderColor: "#146EFF"}} onClick={this.logout} className="LogoutButton">Logout</Button>
          </TabPanel>
        </div>
      </div>

        // <Menu onClick={handleclick} selectedKeys={[current]} mode="horizontal" theme="dark">
        //     <SubMenu key="SubMenu" icon={<MenuOutlined />} title="">
        //         <Menu.ItemGroup title="Item 1">
        //             <Menu.Item key="setting:1">Other Option 1</Menu.Item>
        //             <Menu.Item key="setting:2">Other Option 2</Menu.Item>
        //         </Menu.ItemGroup>
        //         <Menu.ItemGroup title="Item 2">
        //             <Menu.Item key="setting:3">Other Option 3</Menu.Item>
        //             <Menu.Item key="setting:4">Other Option 4</Menu.Item>
        //         </Menu.ItemGroup>
        //     </SubMenu>
        //     <Menu.Item onClick={toTransactions} key="transaction" icon={<TransactionOutlined />}>
        //         Transactions
        //     </Menu.Item>
        //     <Menu.Item  onClick = {toHistory} key="clock" icon={<ClockCircleOutlined />}>
        //         History
        //     </Menu.Item>
        // </Menu>
    );
}
export default Navbar;