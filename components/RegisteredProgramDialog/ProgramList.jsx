import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Link from "next/link";

const ListOfProgram = ({ filteredPrograms }) => {
  // handling data
  const weekday = {
    M: "Mondays",
    Sa: "Saturdays",
    Su: "Sundays",
    F: "Fridays",
    Tu: "Tuesdays",
    W: "Wednesdays",
    "M, Tu, W, Th, F": "Weekdays",
    Th: "Thursdays",
    "W, Th, F": "Wed to Fri",
    "Su, Sa": "Weekends",
    "Tu, W, Th, F": "Tue to Fri",
    "Su, M, Tu, W, Th, F, Sa": "Everyday",
    "Su, W, Th, F, Sa": "Wed to Sun",
    "Su, F, Sa": "Sat to Fri",
  };

  return (
    <List className="p-5 font-satoshi font-light">
      {filteredPrograms.map((program) => (
        <section>
          <ListItem disablePadding key={program.program._id}>
            <Link target="_blank" rel="noopener noreferrer" href={`/programs/registered/${program.program["Course_ID"]}`}>
              <ListItemButton>
                Every<span className="font-medium ms-1 me-1"> {weekday[program.program["Days of The Week"]]}</span> from{" "}
                <span className="font-medium ms-1 me-1">{program.program["Start Date"].split("T")[0]}</span> at{" "}
                <span className="font-medium ms-1 me-1">
                  {program.program["Start Hour"]}:
                  {program.program["Start Min"] < 10 ? `0${program.program["Start Min"]}` : program.program["Start Min"]}{" "}
                </span>
              </ListItemButton>
            </Link>
          </ListItem>
          <Divider />
        </section>
      ))}
    </List>
  );
};

const ProgramList = ({ locationID, programs }) => {
  const [filteredPrograms, setFilteredPrograms] = useState([]);

  useEffect(() => {
    const filtered = filterByLocation(locationID);
    setFilteredPrograms(filtered);
  }, []);

  const filterByLocation = (locationID) => {
    const filtered = programs.filter((program) => {
      return program.location && program.location["Location ID"] === locationID;
    });
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.program["Start Date"]);
      const dateB = new Date(b.program["Start Date"]);

      // Use the subtraction of Date objects for sorting
      return dateA - dateB;
    });
    return sorted;
  };

  if (filteredPrograms.length === 0) {
    return <div>No results found</div>;
  }

  const locationName = filteredPrograms[0].location["Asset Name"].split(" ");
  for (let i = 0; i < locationName.length; i++) {
    locationName[i] = locationName[i][0].toUpperCase() + locationName[i].substr(1).toLowerCase() + " ";
  }
  return (
    <div>
      <div className="flex justify-center">
        <h1 className="w-full items-start text-left sm:ms-10 ms-5 mt-5 sm:text-lg text-md font-inter font-extralight">
          All {filteredPrograms[0].program["Course Title"]} programs at{" "}
          <span className="flex sm:hidden">
            <div></div>
          </span>
          <span className="text-lg sm:text-xl font-light">{locationName}</span>
        </h1>
      </div>

      <ListOfProgram filteredPrograms={filteredPrograms} />
    </div>
  );
};

export default ProgramList;
