"use client";

import { useState, useEffect } from "react";

import ShowCalendar from "./ShowCalendar";
import ShowLocation from "./ShowLocation";
import ProgramList from "./ProgramList";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Fragment } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const RegisteredProgramDialog = ({ open, handleClose, program, programs }) => {
  // handle show tab
  const [showSection, setShowSection] = useState("calendar");

  // check if programs are loaded
  const [programLoaded, setProgramLoaded] = useState(false);

  // handle data from ShowLocation
  const [locationID, setLocationID] = useState("");

  const handleCallback = (childData) => {
    setLocationID(childData);
    setShowSection("list");
  };

  useEffect(() => {
    if (programs.length > 0) {
      setProgramLoaded(true);
    }
  }, [programs]);

  // handling data
  const weekday = {
    M: "Mondays",
    Sa: "Saturdays",
    Su: "Sundays",
    F: "Fri",
    Tu: "Tue",
    W: "Wed",
    "M, Tu, W, Th, F": "Weekdays",
    Th: "Thu",
    "W, Th, F": "Wed to Fri",
    "Su, Sa": "Weekends",
    "Tu, W, Th, F": "Tue to Fri",
    "Su, M, Tu, W, Th, F, Sa": "Day",
    "M, W, F": "Mon, Wed and Fri",
  };
  var activityTitle = "";

  try {
    activityTitle = programs[0].program["Activity Title"];
  } catch {}

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
            <h1 className="font-inter font-light text-lg mt-20">{activityTitle}</h1>
            <h1 className="font-inter font-bold text-xl ">{program.title}</h1>
            <h2 className="font-satoshi text-sm mt-2 ">{program.description}</h2>
          </div>
          <Divider className="mt-4" />
          {/* Selector */}
          <div className="flex w-full justify-center mt-5">
            {showSection === "calendar" ? (
              <button
                className="mx-2 text-xs md:text-sm font-satoshi border px-1.5 py-1 rounded border-sky-600 bg-sky-700 text-white hover:bg-transparent hover:text-sky-800"
                onClick={() => setShowSection("calendar")}
              >
                <CalendarMonthIcon className="mr-2" />
                By Program Start Date
              </button>
            ) : (
              <button
                className="mx-2 text-xs md:text-sm font-satoshi border px-1.5 py-1 rounded border-sky-600 text-sky-800 hover:bg-sky-700 hover:text-white"
                onClick={() => setShowSection("calendar")}
              >
                <CalendarMonthIcon className="mr-2" />
                By Program Start Date
              </button>
            )}

            {showSection === "location" ? (
              <button
                className="mx-2 text-xs md:text-sm font-satoshi border px-1.5 py-1 rounded border-sky-600 bg-sky-700 text-white hover:bg-transparent hover:text-sky-800"
                onClick={() => setShowSection("location")}
              >
                <LocationOnIcon className="mr-2" />
                By Location
              </button>
            ) : (
              <button
                className="mx-2 text-xs md:text-sm font-satoshi border px-1.5 py-1 rounded border-sky-600 text-sky-800 hover:bg-sky-700 hover:text-white"
                onClick={() => setShowSection("location")}
              >
                <LocationOnIcon className="mr-2" />
                By Location
              </button>
            )}
          </div>
          {showSection === "location" ? <ShowLocation programs={programs} parentCallback={handleCallback} /> : ""}
          {showSection === "calendar" ? <ShowCalendar programs={programs} /> : ""}
          {showSection === "list" ? <ProgramList locationID={locationID} programs={programs} /> : ""}
        </div>
      </Dialog>
    </div>
  );
};

export default RegisteredProgramDialog;
