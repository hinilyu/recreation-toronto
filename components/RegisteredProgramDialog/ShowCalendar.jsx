"use client";

import { useEffect, useState } from "react";
import { List } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ClearIcon from "@mui/icons-material/Clear";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ShowCalendar = ({ programs }) => {
  const [uniqueStartDates, setUniqueStartDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showSection, setShowSection] = useState("list");
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const month = ["Jan", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const now = Date.now();

  const handleDateClick = (date) => {
    const dateString = date.toISOString();
    setSelectedDate(dateString);
  };

  const handleClear = () => {
    setSelectedDate("");
    setShowSection("list");
  };

  const filterPrograms = () => {
    const filtered = programs
      .filter((program) => {
        return program.program["Start Date"] == selectedDate;
      })
      .sort((a, b) => {
        return a.program["Start Hour"] - b.program["Start Hour"];
      });
    setFilteredPrograms(filtered);
  };

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
    "Su, W, Th, F, Sa": "Wed to Sun",
    "Su, F, Sa": "Sat to Fri",
  };

  useEffect(() => {
    if (selectedDate !== "") {
      setShowSection("detail");
      filterPrograms();
    }
  }, [selectedDate]);

  useEffect(() => {
    const startDates = programs.map((program) => program.program["Start Date"]);
    const uniqueDates = [...new Set(startDates)];
    const sortedUniqueDates = uniqueDates
      .sort((a, b) => new Date(a) - new Date(b))
      .map((dateString) => {
        const date = new Date(dateString);
        return date;
      });
    setUniqueStartDates(sortedUniqueDates);
  }, [programs]);

  return (
    <div className="p-5 font-satoshi font-light">
      {showSection === "list" ? (
        <div className="p-5 font-satoshi font-light">
          <div className="flex justify-center">
            <h1 className="w-full items-start text-left sm:ms-10 ms-5 lg:mt-5 sm:text-lg text-md font-inter font-medium">
              Select program start date
            </h1>
          </div>
          <List className="p-5 font-satoshi font-light">
            {uniqueStartDates.map((date, index) => {
              return (
                <section key={index}>
                  <ListItem disablePadding onClick={() => handleDateClick(date)}>
                    <ListItemButton>
                      {`${month[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`}
                      {date < now ? (
                        <button disabled className="border-indigo-700 border-2 rounded text-indigo-700 px-2 ms-5 text-xs sm:text-sm">
                          Started
                        </button>
                      ) : (
                        ""
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </section>
              );
            })}
          </List>
        </div>
      ) : (
        <div className="p-5 font-satoshi font-light">
          <div className="flex justify-center">
            <h1 className="w-full items-start text-left sm:ms-10 ms-5 lg:mt-5 sm:text-lg text-md font-inter font-extralight">
              All programs starting from {selectedDate.split("T")[0]}
              <span className="flex sm:hidden">
                <div></div>
              </span>
              <span className="text-lg sm:text-xl font-light">{}</span>
            </h1>
          </div>
          <List className="p-5 font-satoshi font-light">
            {filteredPrograms.map((program, index) => (
              <section key={index}>
                <ListItem disablePadding key={program.program._id}>
                  <Link target="_blank" rel="noopener noreferrer" href={`/programs/registered/${program.program["Course_ID"]}`}>
                    <ListItemButton className="flex flex-col items-start">
                      <h3>
                        Every<span className="font-medium ms-1"> {weekday[program.program["Days of The Week"]]}</span> at{" "}
                        <span className="font-medium ms-1 me-1">
                          {program.program["Start Hour"]}:
                          {program.program["Start Min"] < 10 ? `0${program.program["Start Min"]}` : program.program["Start Min"]}{" "}
                        </span>
                      </h3>

                      <div className="font-medium mt-1">
                        <LocationOnIcon />
                        {program.location ? program.location["Asset Name"] : "Please check on eFun website"}
                      </div>
                    </ListItemButton>
                  </Link>
                </ListItem>
                <Divider />
              </section>
            ))}
          </List>
          <div className="flex justify-center">
            <button className="align-middle rounded bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm" onClick={handleClear}>
              <ClearIcon />
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowCalendar;
