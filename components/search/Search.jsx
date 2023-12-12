"use client";

import { use, useEffect, useState } from "react";
import DefaultResult from "./DefaultResult";
import SpecificSearchResult from "./SpecificSearchResult";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Drawer from "@mui/material/Drawer";
import CancelIcon from "@mui/icons-material/Cancel";

const Search = () => {
  const [registeredPrograms, setRegisteredPrograms] = useState([]);
  const [trimmedRegPrograms, setTrimmedRegPrograms] = useState([]);
  const [dropPrograms, setDropPrograms] = useState([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState();
  const [position, setPosition] = useState([]);
  const [loadingPosition, setLoadingPosition] = useState(false);

  //pass callback
  const parentSetUseCurrentLocation = (useCurrentLocation) => {
    setUseCurrentLocation(useCurrentLocation);
  };

  const parentSetPosition = (position) => {
    setPosition(position);
  };

  // fetch
  const fetchRegisteredPrograms = async () => {
    const response = await fetch("/api/programs/registered");
    const data = await response.json();
    if (data.length > 0) {
      setRegisteredPrograms(data);
      const trimmed = data.splice(1, 20);
      setTrimmedRegPrograms(trimmed);
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
      setDropPrograms(data);
    } catch (error) {
      setDropPrograms("error");
    }
  };

  useEffect(() => {
    fetchRegisteredPrograms();
  }, []);

  // Reload program after position changed
  useEffect(() => {
    fetchDropinPrograms();
    console.log("position reload");
  }, [position]);

  // When user allow using geolocation
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

  useEffect(() => {
    if (useCurrentLocation === true) {
      console.log("usecurrentlocation changed");
      if (!sessionStorage.getItem("position")) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        setLoadingPosition(true);
      }
    }
  }, [useCurrentLocation]);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [open, setOpen] = useState(false);

  const [isSpecificSearch, setIsSpecificSearch] = useState(false);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        setSearchParams({ keyword: e.target.value });
      }, 500)
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (searchText !== "") {
      setIsSpecificSearch(true);
    } else {
      setIsSpecificSearch(false);
    }
  }, [searchText]);

  return (
    <section className="mt-3">
      <div className="relative w-full flex-center">
        <input type="text" placeholder="Quick Search on this page" value={searchText} onChange={handleSearchChange} className="search_input peer" />
        <div
          onClick={handleOpen}
          className="absolute right-5 bg-slate-100 hover:bg-slate-200 py-1 px-1.5 text-sm rounded font-inter font-semibold items-center inline-flex"
        >
          Advanced Search
        </div>
      </div>

      {/* Default Search Result */}
      {isSpecificSearch ? (
        <SpecificSearchResult searchParams={searchParams} registeredPrograms={registeredPrograms} dropPrograms={dropPrograms} />
      ) : (
        <DefaultResult
          fetchDropinPrograms={fetchDropinPrograms}
          registeredPrograms={trimmedRegPrograms}
          dropPrograms={dropPrograms}
          useCurrentLocation={useCurrentLocation}
          parentSetUseCurrentLocation={parentSetUseCurrentLocation}
          loadingPosition={loadingPosition}
          parentSetPosition={parentSetPosition}
          position={position}
        />
      )}
      {/* <Drawer open={open} anchor="left" onClose={() => setOpen(false)}></Drawer> */}
    </section>
  );
};

export default Search;
