"use client";

import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Fragment } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

const steps = ["Location", "Day of Week", "Date & Time"];

const RegisteredProgramDialog = ({ open, handleClose, program, programs }) => {
  // Stepper
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepOptional = (step) => {
    return step === 99;
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
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" className="max-h-[100dvh]">
        <Button
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            left: 25,
            top: 25,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <ArrowBackIosNewIcon />
          Back
        </Button>
        <div className="h-[85dvh] ">
          {/* Title and Description */}
          <div className="px-10">
            <h1 className="font-inter font-semibold text-lg mt-20">{program.title}</h1>
            <h2 className="font-satoshi text-sm mt-2 ">{program.description}</h2>
          </div>
          {/* Selector */}
          <div className="flex w-full">
            <button className="button">By Location</button>
            <button className="button">By Date</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default RegisteredProgramDialog;
