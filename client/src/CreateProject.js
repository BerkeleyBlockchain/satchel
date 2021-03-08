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

function getStepContent(step) {
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
                  <Input type="string" name="text" id="amount" placeholder="Enter project name" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}/>
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
                  <Input type="string" name="text" id="amount" placeholder="Enter project description" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}/>
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
                  <Input type="string" name="text" id="amount" placeholder="Enter amount of funding needed" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}/>
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
                  <Input type="string" name="text" id="amount" placeholder="Enter subsection title" style={{ backgroundColor:"#ECF3FF", color:"black", borderRadius:"10px", border:"white", fontSize: "12px"}}/>
                </FormGroup>
            </Form>
          </div>

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

export default function CreateProject() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();
  
  //stuff for the server
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [targetFunding, setTargetFunding] = useState(0);
  const [fundingBreakdown, setFundingBreakdown] = useState('');


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
      <SchoolNavBar Balance={500} Withdraw={300} Name='Melissa' activeTab={1}/>
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
            <Typography> {getStepContent(activeStep)} </Typography>
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