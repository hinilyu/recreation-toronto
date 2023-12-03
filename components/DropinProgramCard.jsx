"use client";

import PoolIcon from "@mui/icons-material/Pool";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import IceSkatingIcon from "@mui/icons-material/IceSkating";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import { useState } from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProgramCard = ({ program }) => {
  // handle datetime
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const datetime = new Date(program["Start Date Time"]);

  // Control Dialog
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  // Control Tab
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [programs, setPrograms] = useState([]);

  const fetchPrograms = async ({ title }) => {
    const response = await fetch(`api/programs/registered/${program.title}`);
    const data = await response.json();
    console.log(data);
    setPrograms(data);
  };

  useEffect(() => {
    if (open) {
      fetchPrograms(program.title);
    }
  }, [open]);

  var icon = "";
  if (program.Category === "Swimming") {
    icon = <PoolIcon style={{ color: "CornflowerBlue" }} />;
  } else if (program.Category === "Arts") {
    icon = <ColorLensIcon style={{ color: "darkred" }} />;
  } else if (program.Category === "Sports") {
    icon = <DirectionsRunIcon style={{ color: "saddlebrown" }} />;
  } else if (program.Category === "Skating") {
    icon = <IceSkatingIcon style={{ color: "skyblue" }} />;
  } else if (program.Category === "Fitness") {
    icon = <FitnessCenterIcon style={{ color: "maroon" }} />;
  } else if (program.Category === "General") {
    icon = <FamilyRestroomIcon style={{ color: "lightslategray" }} />;
  } else if (program.Category === "Dance") {
    icon = <SportsGymnasticsIcon style={{ color: "indigo" }} />;
  } else if (program.Category === "Cooking") {
    icon = <RestaurantMenuIcon style={{ color: "goldenrod" }} />;
  } else if (program.Category === "Music") {
    icon = <MusicNoteIcon style={{ color: "SlateBlue" }} />;
  }

  return (
    <div className="program_card hover:cursor-pointer hover:bg-slate-200" onClick={handleClickOpen}>
      <div className="flex justify-between items-start gap-5">
        <div>
          {/* Category Icon */}
          {icon}
        </div>
        {program.distance ? <div className="text-xs">{program.distance}km away</div> : <div></div>}
      </div>

      {/* Title */}
      <h1 className="font-inter text-lg font-semibold mt-2 line-clamp-2">{program["Course Title"]}</h1>
      <h2 className="font-inter text-xs ">{program.locationDetails[0] ? program.locationDetails[0]["Asset Name"] : ""}</h2>
      <h2 className="font-inter text-sm mt-3">
        {weekday[datetime.getDay()]}, {month[datetime.getMonth()]} {datetime.getDate()}
      </h2>
      <h2 className="font-inter text-md mt-1">
        {datetime.getHours()}:{datetime.getMinutes() < 10 ? <span>0{datetime.getMinutes()}</span> : <span>{datetime.getMinutes()}</span>}
      </h2>
    </div>
  );
};

export default ProgramCard;
