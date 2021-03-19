import React, { useState, Component } from 'react';
import { CardBody, CardSubtitle, TabContent, TabPane, NavLink, Container, Row, Col, ButtonGroup, Form, FormGroup, Label, Input, Table, Card, CardText, CardTitle, Button, Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import Typography from '@material-ui/core/Typography';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import MenuBookOutlinedIcon from '@material-ui/icons/MenuBookOutlined';
import SchoolNavBar from './SchoolNavBar.js'
import axios from 'axios';

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

function getStepContent(step, setProjectName, setProjectDes, setFundingAmt, setFundingBreak) {

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
          <Button style={{ backgroundColor:"#146EFF", color: "white", fontWeight:"bold", borderRadius: "10px", borderWidth:"0px"}} className="ProjectNextButton" type="submit">+ Add Another Subsection</Button>
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
    // console.log(projectName);
    // console.log(projectDes);
    // console.log(fundingAmt);
    // console.log(fundingBreak);

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);

    if (activeStep == 2) {
      handleRequest();
    }
  };

  const handleRequest = async() => {
    await axios.post('http://localhost:4000/api/project/createProject', {
            "name": projectName, 
            "description": projectDes,
            "targetFunding": fundingAmt,
            "fundingBreakdown": fundingBreak,
            "schoolAddress": "0x551192f78F5F1d30385415A59e008FFfc94Ab940",
        });
    };


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

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <SchoolNavBar Balance={props.location.Balance} Withdraw={props.location.Withdraw} Name={props.location.Name} activeTab={props.location.activeTab}/>
      <div className="CreateProjectPageTitle"> Create Project</div>
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
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div className="Stepper">
            {/*pass in more arguments to the getStepContent func(state functions)*/}
            <Typography> {getStepContent(activeStep, setProjectName, setProjectDes, setFundingAmt, setFundingBreak)} </Typography>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} 
                style={{ backgroundColor:"white", fontWeight: "bold", color:"#146EFF", borderRadius: "10px", borderWidth:"3px", borderColor: "#146EFF"}}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                style={{ backgroundColor:"#146EFF", color: "white", fontWeight:"bold", borderRadius: "10px", borderWidth:"3px", borderColor: "#146EFF"}}
              >
                {activeStep === steps.length - 1 ? 'Return to Projects Page' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}