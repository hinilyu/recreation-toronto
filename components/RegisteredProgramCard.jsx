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

import PropTypes from "prop-types";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import RegisteredProgramDialog from "./RegisteredProgramDialog/RegisteredProgramDialog";

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
  // Control Dialog
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
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
  if (program.category === "Swimming") {
    icon = <PoolIcon style={{ color: "CornflowerBlue" }} />;
  } else if (program.category === "Arts") {
    icon = <ColorLensIcon style={{ color: "darkred" }} />;
  } else if (program.category === "Sports") {
    icon = <DirectionsRunIcon style={{ color: "saddlebrown" }} />;
  } else if (program.category === "Skating") {
    icon = <IceSkatingIcon style={{ color: "skyblue" }} />;
  } else if (program.category === "Fitness") {
    icon = <FitnessCenterIcon style={{ color: "maroon" }} />;
  } else if (program.category === "General") {
    icon = <FamilyRestroomIcon style={{ color: "lightslategray" }} />;
  } else if (program.category === "Dance") {
    icon = <SportsGymnasticsIcon style={{ color: "indigo" }} />;
  } else if (program.category === "Cooking") {
    icon = <RestaurantMenuIcon style={{ color: "goldenrod" }} />;
  } else if (program.category === "Music") {
    icon = <MusicNoteIcon style={{ color: "SlateBlue" }} />;
  }

  program.description = program.description.replace(/<br>/g, "");

  return (
    <div className="program_card hover:cursor-pointer hover:bg-slate-200" onClick={handleClickOpen}>
      <div className="flex justify-between items-start gap-5">
        <div>
          {/* Category Icon */}
          {icon}
        </div>
        <div>
          <p className="text-xs">{program.count} programs available</p>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-inter text-lg font-semibold mt-2 line-clamp-2">{program.title}</h1>
      <p className="font-satoshi text-sm line-clamp-5 hover:overflow-auto select-none h-[100px]">{program.description}</p>

      <RegisteredProgramDialog open={open} handleClose={handleClose} program={program} programs={programs} />
    </div>
  );
};

export default ProgramCard;
