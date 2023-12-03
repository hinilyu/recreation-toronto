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

const DropinProgramNearbyList = ({ data, position, useCurrentLocation }) => {
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

const DefaultResult = () => {
  const [registeredPrograms, setRegisteredPrograms] = useState([]);
  const [dropPrograms, setDropPrograms] = useState([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState();
  const [position, setPosition] = useState([]);
  const [loadingPosition, setLoadingPosition] = useState(false);

  // fetch
  const fetchRegisteredPrograms = async () => {
    const response = await fetch("/api/programs/registered");
    const data = await response.json();
    console.log(data);
    if (data.length > 0) {
      setRegisteredPrograms(data);
    } else {
      setRegisteredPrograms("error");
    }
  };

  const fetchDropinPrograms = async () => {
    try {
      const response = await fetch(`/api/programs/dropin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          useCurrentLocation: sessionStorage.getItem("useCurrentLocation"),
          lat: position[0],
          lng: position[1],
        }),
      });

      const data = await response.json();
      console.log(data);
      setDropPrograms(data);
    } catch (error) {
      setDropPrograms("error");
    }
  };

  // Getting Geolocation
  const successCallback = async (position) => {
    const { latitude, longitude } = await position.coords;
    sessionStorage.setItem("position", JSON.stringify([latitude, longitude]));
    setPosition([latitude, longitude]);
    setLoadingPosition(false);
  };

  const errorCallback = (error) => {
    alert("We are having trouble getting your location. Please try again.");
    setUseCurrentLocation(false);
  };

  // When starting app
  useEffect(() => {
    const position = JSON.parse(sessionStorage.getItem("position"));

    if (position) {
      setPosition(position);
      setUseCurrentLocation(true);
    }

    fetchRegisteredPrograms();
  }, []);

  // Reload program after position changed
  useEffect(() => {
    fetchDropinPrograms();
  }, [position]);

  // When user allow using geolocation
  useEffect(() => {
    if (useCurrentLocation === true) {
      if (!sessionStorage.getItem("position")) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        setLoadingPosition(true);
      }
    }
  }, [useCurrentLocation]);

  return (
    <section className="mt-3">
      <h1 className="section_header">
        Registered Program You May Like
        <Tooltip
          className="ms-2"
          title="Search and register for a variety of programs including camps, swimming lessons, skating & hockey lessons, fitness classes, dances classes and much more."
        >
          <InfoIcon />
        </Tooltip>
      </h1>
      <div className="sm:h-[500px] h-[250px] overflow-y-auto mt-3">
        <RegisterProgramList data={registeredPrograms} />
      </div>
      <h1 className="section_header">
        {useCurrentLocation ? "Drop-In Nearby" : "Drop-In Program You May Like"}
        <Tooltip
          className="ms-2"
          title="The City of Toronto offers many activities and programs where you can drop in at the scheduled time without prior registration."
        >
          <InfoIcon />
        </Tooltip>
        {loadingPosition ? <CircularProgress size={20} className="ml-3" /> : <div></div>}
        {useCurrentLocation ? (
          <div></div>
        ) : (
          <Button
            className="text-xs"
            onClick={() => {
              setUseCurrentLocation(true);
              sessionStorage.setItem("useCurrentLocation", JSON.stringify(true));
            }}
          >
            Use Current Location
          </Button>
        )}
      </h1>
      <div className="sm:h-[500px] h-[250px] overflow-y-auto mt-3">
        {useCurrentLocation ? <DropinProgramNearbyList data={dropPrograms} position={position} /> : <DropinProgramList data={dropPrograms} />}
      </div>
    </section>
  );
};

export default DefaultResult;
