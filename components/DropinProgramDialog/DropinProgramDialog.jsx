import Link from "next/link";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Divider from "@mui/material/Divider";
import { CircularProgress } from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const DropinProgramDialog = ({ open, handleClose, program }) => {
  const locationDetails = program.locationDetails[0];

  //handle map
  var center = {};
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.MAPS_API_KEY,
  });
  if (locationDetails) {
    center = { lat: locationDetails.Coordinates[1], lng: locationDetails.Coordinates[0] };
  }
  // handling data
  const month = ["Jan", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
  const startDate = new Date(program["Start Date Time"]);

  var startMin = "";
  var endMin = "";
  if (program["Start Minute"] < 10) {
    startMin = "0" + program["Start Minute"];
  } else {
    startMin = program["Start Minute"];
  }
  if (program["End Min"] < 10) {
    endMin = "0" + program["End Min"];
  } else {
    endMin = program["End Min"];
  }

  //handle age
  var age = "";
  if (program["Age Max"] === "None" && program["Age Min"] === "None") {
    age = "All ages";
  } else if (program["Age Max"] == "None") {
    age = `${program["Age Min"] / 12} Yrs. and over`;
  } else if (program["Age Min"] == "None") {
    age = `${program["Age Max"] / 12} Yrs. and under `;
  } else {
    age = `${program["Age Min"] / 12} Yrs. to ${program["Age Max"] / 12} Yrs.`;
  }

  if (!locationDetails) {
    return <div></div>;
  }

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
          <div className="px-10 mt-20">
            <h1 className="font-light text-xl md:mt-20 mt-10">{program["Category"]}</h1>
            <h1 className="font-bold text-3xl ">{program["Course Title"]}</h1>
            {/* Location */}
            <h3 className="text-sm md:text-lg bg-slate-200 hover:bg-slate-300 inline-block py-1 px-3 rounded mt-1">
              <Link target="_blank" href={`https://www.toronto.ca/data/parks/prd/facilities/complex/${locationDetails["Location ID"]}/index.html`}>
                {locationDetails["Asset Name"]}
              </Link>
            </h3>
            {/* Datetime */}
            <h3 className="mt-5 font-light">{`${month[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`}</h3>
            <h3 className="text-lg">{`${program["Start Hour"]}:${startMin} - ${program["End Hour"]}:${endMin}`}</h3>
            {/* Age */}
            <h3 className="mt-5">
              <span className="font-medium">Age: </span>
              {`${age}`}
            </h3>
            {/* Link */}
            <Link target="_blank" href={`https://www.toronto.ca/data/parks/prd/facilities/complex/${locationDetails["Location ID"]}/index.html`}>
              <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 border border-orange-700 rounded text-sm mt-5">
                Official Website
              </button>
            </Link>

            <div className="flex justify-center w-[100%] max-w-[800px] md:h-[600px] h-[400px] sm:p-10 p-3">
              {!isLoaded ? (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              ) : (
                <GoogleMap mapContainerClassName="w-full h-full" center={center} zoom={14}>
                  <Marker position={center}></Marker>
                </GoogleMap>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DropinProgramDialog;
