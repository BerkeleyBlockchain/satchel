import React, { useState, Component } from 'react';
import { CardBody, CardSubtitle, TabContent, TabPane, NavLink, Container, Row, Col, ButtonGroup, Form, FormGroup, Label, Input, Table, Card, CardText, CardTitle, Button, Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import Typography from '@material-ui/core/Typography';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import SchoolNavBar from './SchoolNavBar.js'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const stheme = createMuiTheme({
     palette: {
      primary: {
          main: '#146EFF'
      },
      secondary: {
        main: '#146EFF'
    }
    },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return [' ', ' ', ' '];
}

function getStepContent(step, setProjectName, setProjectDes, setFundingAmt, setFundingBreak, inputList, setInputList) {

   // handle input change
   const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { percent: "", category: "" }]);
  };

  switch (step) {
    case 0:
      return (
        <div>

        <div className="CreateProjectTitle">
          Project Name
        </div>

          <div>
            <Form>
                <FormGroup className="ProjectNameField">
                  <Label for="amount"></Label>
                  {/*Include onChange function to collect userInput. Save collected info to state */}
                  {/*pass in new funcs that call set funcs */}
                  <Input onChange={e => setProjectName(e.target.value)} type="string" name="text" id="amount" placeholder="Enter project name" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}/>
                  {/* {console.log(projectName)} */}
                </FormGroup>
            </Form>
          </div>

          <div className="CreateProjectTitle">
            Project Description
          </div>

          <div>
            <Form>
                <FormGroup className="ProjectDescriptionField">
                  <Label for="amount"></Label>
                  {/*Include onChange function to collect userInput. Save collected info to state */}
                  <Input onChange={e => setProjectDes(e.target.value)} type="string" name="text" id="amount" placeholder="Enter project description" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}/>
                </FormGroup>
            </Form>
          </div>
      </div>
      );
    case 1:
      return (
        <div>
        <div className="CreateProjectTitle">
            Target Funding
        </div>

          <div>
            <Form>
                <FormGroup className="ProjectNameField">
                  <Label for="amount"></Label>
                  {/*Include onChange function to collect userInput. Save collected info to state */}
                  <Input onChange={e => setFundingAmt(e.target.value)}  type="string" name="text" id="amount" placeholder="Enter amount of funding needed" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}/>
                </FormGroup>
            </Form>
          </div>

          <div className="CreateProjectTitle">
            Funding Breakdown
          </div>

          <div>
            <Form>
                <FormGroup className="ProjectDescriptionField">
                  <Label for="amount"></Label>
                  {/*Include onChange function to collect userInput. Save collected info to state */}
                  <Input onChange={e => setFundingBreak(e.target.value)} type="string" name="text" id="amount" placeholder="Enter funding breakdown" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}/>
                </FormGroup>
            </Form>
          </div>
          {/*Once user submits, store data in server */}
          {inputList.map((x, i) => {
      return (
        <div>
        <Container>
        <Row>
          <Col xs="4" >
          <Input
            name="percent"
            placeholder="10%"
            value={x.percent}
            onChange={e => handleInputChange(e, i)}
            style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}
          />
          </Col>
          <Col xs="8">
          <Input
            name="category"
           placeholder="Enter Category Name"
            value={x.category}
            onChange={e => handleInputChange(e, i)}
            style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}
          />
          </Col>
        </Row>
        </Container>
          <div className="btn-box">
            {inputList.length !== 1 && 
            <Button onClick={() => handleRemoveClick(i)} style={{ backgroundColor:"#146EFF", color: "white", fontWeight:"bold", borderRadius: "10px", borderWidth:"0px"}} className="ProjectNextButton" type="submit">Remove</Button>}
            {inputList.length - 1 === i &&  <Button onClick={handleAddClick} style={{ backgroundColor:"#146EFF", color: "white", fontWeight:"bold", borderRadius: "10px", borderWidth:"0px"}} className="ProjectNextButton" type="submit">+ Add Another Subsection</Button>}
          </div>
        </div>
      );
    })}

      </div>
      );
    case 2:
      return (
        <div>
        <div className="CongratulationsCreateProject">
            Congratulations!
        </div>

        <div className="CreateProjectsFinished"> The project <b>Buy Student Desks</b> is now created! You can view the details on the projects page.</div>

        {/* <Button style={{ backgroundColor:"#146EFF", color: "white", fontWeight:"bold", borderRadius: "10px", borderWidth:"0px"}} className="AmountButton" type="submit">Return to Projects Page</Button> */}
      </div>
      );
    default:
      return 'Unknown step';
  }
}





export default function CreateProject(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  //states for create project

  const [projectName, setProjectName] = useState('');
  const [projectDes, setProjectDes] = useState('');
  const [fundingAmt, setFundingAmt] = useState(0);
  const [fundingBreak, setFundingBreak] = useState('');
  const [inputList, setInputList] = useState([{ percent: "", category: "" }]);

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);

    if (activeStep == 2) {
      handleRequest();
      handleFinish();
    }
  };

  const handleRequest = async() => {
    console.log(props.location.schoolAddress)
    try {
      await axios.post('http://localhost:4000/api/project/createProject', {
            "name": projectName, 
            "description": projectDes,
            "targetFunding": fundingAmt,
            "fundingBreakdown": fundingBreak,
            "schoolAddress": props.location.schoolAddress,
        })
    } catch (error) {
      console.log(error.message);
    }
  }


  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  const history = useHistory();
  const handleFinish = (event) => {
      history.push({
        pathname: '/SchoolDashboard',
        state: {
          Name: props.Name,
          Withdraw: props.Withdraw,
          Balance: props.Balance,
          schoolAddress: props.location.schoolAddress,
          activeTab: 1,
        },
      });
  };

  return (
    <div className={classes.root}>
      <SchoolNavBar Balance={props.location.Balance} Withdraw={props.location.Withdraw} Name={props.location.Name} activeTab={props.location.activeTab}/>
      <div className="CreateProjectPageTitle"> Create Project</div>
      <MuiThemeProvider theme={stheme}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant="caption"></Typography>;
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </MuiThemeProvider>
      <div>
          <div className="Stepper">
            {/*pass in more arguments to the getStepContent func(state functions)*/}
            <Typography> {getStepContent(activeStep, setProjectName, setProjectDes, setFundingAmt, setFundingBreak, inputList, setInputList)} </Typography>
            <div>
            {activeStep !== steps.length - 1 ? 
              <Button disabled={activeStep === 0} onClick={handleBack} 
                style={{ backgroundColor:"white", fontWeight: "bold", color:"#146EFF", borderRadius: "10px", borderWidth:"3px", borderColor: "#146EFF", marginRight:"10%", width:"40%"}}>
                Back
              </Button>: ""}
              
              {activeStep === steps.length - 1 ? 
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  style={{ backgroundColor:"#146EFF", color: "white", fontWeight:"bold", borderRadius: "10px", borderWidth:"3px", borderColor: "#146EFF", width:"100%"}}
                >
                Return to Projects Page
              </Button>
                  :
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  style={{ backgroundColor:"#146EFF", color: "white", fontWeight:"bold", borderRadius: "10px", borderWidth:"3px", borderColor: "#146EFF", width:"40%"}}
                >
                Next
                </Button>
                }
                

            </div>
          </div>
      </div>
    </div>
  );
}