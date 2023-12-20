import RegisteredProgramCard from "@components/RegisteredProgramCard";
import DropinProgramCard from "@components/DropinProgramCard";
import { useState, useEffect } from "react";
import { Button, Tooltip } from "@mui/material";
import Link from "next/link";
import SkeletonCard from "./SkeletonCard";
import CircularProgress from "@mui/material/CircularProgress";
import InfoIcon from "@mui/icons-material/Info";

const RegisterProgramList = ({ data }) => {
  if (data == "error") {
    return <div className="my-10 font-satoshi text-center">Unable to load. Refresh to try again.</div>;
  }
  if (data.length > 0) {
    return (
      <div className="program_layout">
        {data.map((program) => (
          <RegisteredProgramCard key={program.title} program={program} />
        ))}
      </div>
    );
  } else {
    return <SkeletonCard />;
  }
};

const DropinProgramList = ({ data }) => {
  if (data == "error") {
    return <div className="my-10 font-satoshi text-center">Unable to load. Refresh to try again.</div>;
  }
  if (data.length > 0) {
    return (
      <div className="program_layout">
        {data.map((program) => (
          <DropinProgramCard key={program._id} program={program} />
        ))}
      </div>
    );
  } else {
    return <SkeletonCard />;
  }
};

const DropinProgramNearbyList = ({ data, useCurrentLocation }) => {
  if (useCurrentLocation === false || !navigator.geolocation) {
    return <div className="my-10 font-satoshi text-center">Please allow sharing your location</div>;
  }
  if (data == "error") {
    return <div className="my-10 font-satoshi text-center">Unable to load. Refresh to try again.</div>;
  }
  if (data.length > 0) {
    return (
      <div className="program_layout">
        {data.map((program) => (
          <DropinProgramCard key={program._id} program={program} />
        ))}
      </div>
    );
  } else {
    return <SkeletonCard />;
  }
};

const DefaultResult = ({ registeredPrograms, dropPrograms, parentSetUseCurrentLocation, useCurrentLocation, loadingPosition, parentSetPosition }) => {
  // When starting app
  useEffect(() => {
    const sessionPosition = JSON.parse(sessionStorage.getItem("position"));

    if (sessionPosition) {
      parentSetPosition(sessionPosition);
      parentSetUseCurrentLocation(true);
    }
  }, []);

  return (
    <section className="mt-3">
      <h1 className="section_header">
        Registered Programs You May Like
        <Tooltip
          className="ms-2"
          title="Search and register for a variety of programs including camps, swimming lessons, skating & hockey lessons, fitness classes, dances classes and much more."
        >
          <InfoIcon />
        </Tooltip>
      </h1>
      <div className="sm:h-[500px] h-[300px] overflow-y-auto mt-3">
        <RegisterProgramList data={registeredPrograms} />
      </div>
      <h1 className="section_header">
        {useCurrentLocation ? "Drop-In Nearby" : "Drop-In Programs You May Like"}
        <Tooltip
          className="ms-2"
          title="The City of Toronto offers many activities and programs where you can drop in at the scheduled time without prior registration."
        >
          <InfoIcon />
        </Tooltip>
        {loadingPosition ? <CircularProgress size={20} className="ml-3" /> : <div></div>}
        {useCurrentLocation ? (
          <Button
            className="text-xs"
            onClick={() => {
              parentSetUseCurrentLocation(false);
              parentSetPosition([]);
              sessionStorage.setItem("useCurrentLocation", JSON.stringify(false));
              sessionStorage.removeItem("position");
            }}
          >
            Do Not Use Current Location
          </Button>
        ) : (
          <Button
            className="text-xs"
            onClick={() => {
              parentSetUseCurrentLocation(true);
              sessionStorage.setItem("useCurrentLocation", JSON.stringify(true));
            }}
          >
            Use Current Location
          </Button>
        )}
      </h1>
      <div className="sm:h-[500px] h-[300px] overflow-y-auto mt-3">
        {useCurrentLocation ? (
          <DropinProgramNearbyList data={dropPrograms} useCurrentLocation={useCurrentLocation} />
        ) : (
          <DropinProgramList data={dropPrograms} />
        )}
      </div>
    </section>
  );
};

export default DefaultResult;
