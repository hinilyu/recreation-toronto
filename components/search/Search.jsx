"use client";

import { use, useEffect, useState } from "react";
import DefaultResult from "./DefaultResult";
import SpecificSearchResult from "./SpecificSearchResult";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Drawer from "@mui/material/Drawer";
import { Divider, ListItem } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import Radio from "@mui/material/Radio";
import { Button } from "@mui/material";

import List from "@mui/material/List";

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
      console.log(trimmed);
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

  // handle search

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    searchType: "all",
    categories: [], // Array to store selected categories
    age: "All Ages", // Age filter
    daysOfWeek: [], // Array to store selected days of the week
    startDateBetween: [], // Array to store start date range [startDate, endDate]
  });
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

  const handleSearchTypeChange = (type) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      searchType: type,
    }));
    setIsApplied(true);
  };

  const handleCategoryChange = (category) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      categories: (prevParams?.categories || []).includes(category)
        ? (prevParams?.categories || []).filter((c) => c !== category)
        : [...(prevParams?.categories || []), category],
    }));
  };

  const handleDaysOfWeekChange = (day) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      daysOfWeek: prevParams.daysOfWeek.includes(day) ? prevParams.daysOfWeek.filter((d) => d !== day) : [...prevParams.daysOfWeek, day],
    }));
  };

  const handleStartDateBetweenChange = (startDate, endDate) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      startDateBetween: [startDate, endDate],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    if (isApplied) {
      setIsSpecificSearch(true);
    }
  }, [isApplied]);

  useEffect(() => {
    if (
      searchParams.keyword !== "" ||
      searchParams.categories?.length > 0 ||
      searchParams.age !== "All Ages" ||
      searchParams.daysOfWeek.length > 0 ||
      searchParams.startDateBetween.length > 0
    ) {
      setIsSpecificSearch(true);
    } else {
      setIsSpecificSearch(false);
    }
  }, [searchParams]);

  const categories = ["Swimming", "Arts", "Sports", "General", "Dance", "Skating", "Ski", "Camps", "Fitness", "Music"];
  const ages = ["All Ages", "Early Child (<3 yrs)", "Teens (3-18 yrs)", "Adults (18-65 yrs)", "Elderly (>65 yrs)"];
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <section className="mt-3">
      <div className="relative w-full flex-center">
        <input type="text" placeholder="Search by keyword" value={searchText} onChange={handleSearchChange} className="search_input peer" />
        <div
          onClick={handleOpen}
          className="absolute right-5 bg-slate-100 hover:bg-slate-200 py-1 px-1.5 text-sm rounded font-inter font-semibold items-center inline-flex hover:cursor-pointer"
        >
          Filter
          <FilterAltIcon />
        </div>
      </div>

      {/* Default Search Result */}
      {isSpecificSearch ? (
        <div className="flex flex-col justify-center">
          <Button
            variant="outlined"
            className="mt-5"
            onClick={() => {
              setIsApplied(false);
              setSearchText("");
              setSearchParams({
                keyword: "",
                searchType: "all",
                categories: [], // Array to store selected categories
                age: "All Ages", // Age filter
                daysOfWeek: [], // Array to store selected days of the week
                startDateBetween: [], // Array to store start date range [startDate, endDate]
              });
            }}
          >
            Reset Search Filter
          </Button>
          <SpecificSearchResult searchParams={searchParams} registeredPrograms={registeredPrograms} dropPrograms={dropPrograms} />
        </div>
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
      <Drawer
        open={open}
        anchor="left"
        onClose={() => {
          setOpen(false);
        }}
      >
        <List className="p-10">
          <ListItem disablePadding>
            <FormGroup>
              {/* Search Type */}
              <FormControlLabel
                control={<Radio checked={searchParams.searchType === "all"} onChange={() => handleSearchTypeChange("all")} />}
                label="Search All Programs"
              />
              <FormControlLabel
                control={<Radio checked={searchParams.searchType === "available"} onChange={() => handleSearchTypeChange("available")} />}
                label="Only Programs Available For Registration"
              />
            </FormGroup>
          </ListItem>
          <Divider className="my-5" />
          <ListItem>
            <div className="grid grid-cols-2 w-full">
              {" "}
              {/* Categories */}
              {categories.map((category) => (
                <FormControlLabel
                  control={<Checkbox checked={searchParams.categories?.includes(category)} onChange={() => handleCategoryChange(category)} />}
                  label={category}
                />
              ))}
            </div>
          </ListItem>
          <Divider className="my-5" />
          <ListItem>
            {/* Age */}
            <div className="grid grid-cols-2 w-full">
              {ages.map((age) => (
                <FormControlLabel
                  control={
                    <Checkbox checked={searchParams.age === age} onChange={() => setSearchParams((prevParams) => ({ ...prevParams, age: age }))} />
                  }
                  label={age}
                />
              ))}
            </div>
          </ListItem>
          <Divider className="my-5" />
          <ListItem>
            <div className="grid grid-cols-2 w-full">
              {/* Days of the Week */}
              {weekdays.map((weekday) => (
                <FormControlLabel
                  control={<Checkbox checked={searchParams.daysOfWeek?.includes(weekday)} onChange={() => handleDaysOfWeekChange(weekday)} />}
                  label={weekday}
                />
              ))}
            </div>
          </ListItem>
          <Divider className="my-5" />
          <ListItem>
            {" "}
            {/* Start Date Between */}
            {/* You can use DatePicker or any other input for date selection */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex justify-center w-full">
                <DatePicker
                  label="Start Date Between"
                  value={searchParams.startDateBetween && searchParams.startDateBetween[0]}
                  onChange={(date) => handleStartDateBetweenChange(date, searchParams.startDateBetween[1])}
                />
              </div>
            </LocalizationProvider>
            {/* Similar input for End Date */}
          </ListItem>
          <div className="w-full flex justify-around mt-10">
            <Button
              variant="outlined"
              onClick={() => {
                setIsApplied(true);
                setOpen(false);
              }}
            >
              Apply
            </Button>
            <Button variant="outlined" onClick={() => setIsApplied(false)}>
              Reset
            </Button>
          </div>
        </List>
      </Drawer>
    </section>
  );
};

export default Search;
