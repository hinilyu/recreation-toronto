"use client";

import RegisteredProgramCard from "@components/RegisteredProgramCard";
import DropinProgramCard from "@components/DropinProgramCard";

import SkeletonCard from "./SkeletonCard";

import { useEffect, useState } from "react";
import { Button, Tooltip } from "@mui/material";
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
    return <div>No results found</div>;
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
    return <div>No results found</div>;
  }
};

const SpecificSearchResult = ({ searchParams, registeredPrograms, dropPrograms }) => {
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredDropPrograms, setFilteredDropPrograms] = useState([]);

  const filterProgram = () => {
    const keywords = searchParams.keyword.toLowerCase().trim().split(" ");
    const prog = registeredPrograms
      .filter((program) => {
        const title = program.title.toLowerCase();
        const description = program.description.toLowerCase();

        // Check if program has available spots
        const hasAvailableSpots = searchParams.searchType === "available" ? program.hasAvailableSpots : true;

        // Check if all keywords are present in either title or description
        const allKeywordsPresent = !searchParams.keyword || keywords.every((keyword) => title.includes(keyword) || description.includes(keyword));

        // Check categories if searchParams.categories is not empty
        const hasCategories = searchParams.categories?.length > 0;
        const isInCategories = hasCategories ? searchParams.categories.includes(program.category) : true;

        // Check age parameter
        const isAgeSuitable = checkAgeSuitability(program, searchParams.age);

        // Check days of the week
        let hasSelectedDays;
        if (searchParams.daysOfWeek?.length > 0) {
          const selectedDaysAbbreviations = convertToAbbreviations(searchParams.daysOfWeek);
          hasSelectedDays = checkDaysOfWeek(program, selectedDaysAbbreviations);
        } else {
          hasSelectedDays = true;
        }

        return allKeywordsPresent && isInCategories && hasAvailableSpots && isAgeSuitable && hasSelectedDays;
      })

      .sort((a, b) => {
        // Sort by relevance, you can customize this based on your criteria
        if (searchParams.keyword) {
          const aRelevance = keywords.reduce((count, keyword) => count + a.title.toLowerCase().split(keyword).length - 1, 0);
          const bRelevance = keywords.reduce((count, keyword) => count + b.title.toLowerCase().split(keyword).length - 1, 0);

          // Sort in descending order
          return bRelevance - aRelevance;
        }

        return b.count - a.count;
      });

    setFilteredPrograms(prog);
  };

  // Helper function to check age suitability
  const checkAgeSuitability = (program, ageParameter) => {
    const minAge = program.minAge === "None" ? 0 : parseInt(program.minAge);
    const maxAge = program.maxAge === "None" ? Infinity : parseInt(program.maxAge);

    switch (ageParameter) {
      case "All Ages":
        return true;
      case "Early Child":
        return maxAge < 36 || (minAge > 0 && minAge < 36); // 36 months = 3 years
      case "Child":
        return minAge >= 36 && maxAge < 156;
      case "Youth":
        return minAge >= 156 && minAge <= 204; // 36 months = 3 years, 216 months = 18 years
      case "Adults":
        return minAge >= 180; // 216 months = 18 years, 780 months = 65 years
      case "Older Adults":
        return minAge >= 600; // 780 months = 65 years
      default:
        return true;
    }
  };

  // Helper function to convert full day names to abbreviations
  const convertToAbbreviations = (fullDayNames) => {
    const dayMap = {
      Sunday: "Su",
      Monday: "M",
      Tuesday: "Tu",
      Wednesday: "W",
      Thursday: "Th",
      Friday: "F",
      Saturday: "Sa",
    };

    return fullDayNames.map((fullDay) => dayMap[fullDay]);
  };

  // Helper function to check days of the week
  const checkDaysOfWeek = (program, selectedDaysOfWeek) => {
    const programDays = [].concat(...program.daysOfWeek.map((day) => day.split(",").map((d) => d.trim())));
    return selectedDaysOfWeek.some((day) => programDays.includes(day));
  };

  const filterDropProgram = () => {
    if (searchParams.keyword) {
      const keywords = searchParams.keyword.toLowerCase().trim().split(" ");
      const prog = dropPrograms.filter((program) => {
        const title = program["Course Title"].toLowerCase();

        // Check if all keywords are present in either title or description
        return keywords.some((keyword) => title.includes(keyword));
      });
      setFilteredDropPrograms(prog);
    }
  };

  useEffect(() => {
    filterProgram();
    filterDropProgram();
  }, [searchParams]);

  return (
    <div className="mt-3">
      <h1 className="md:text-2xl text-lg text-amber-500 font-satoshi">
        Registered Programs
        <Tooltip
          className="ms-2"
          title="Search and register for a variety of programs including camps, swimming lessons, skating & hockey lessons, fitness classes, dances classes and much more."
        >
          <InfoIcon />
        </Tooltip>
      </h1>
      <div className="sm:h-[500px] h-[250px] overflow-y-auto mt-3">
        <RegisterProgramList data={filteredPrograms} />
      </div>
      <h1 className="md:text-2xl text-lg text-amber-500 font-inter">
        Drop-in Programs
        <Tooltip
          className="ms-2"
          title="The City of Toronto offers many activities and programs where you can drop in at the scheduled time without prior registration."
        >
          <InfoIcon />
        </Tooltip>
      </h1>
      <div className="sm:h-[500px] h-[250px] overflow-y-auto mt-3">
        <DropinProgramList data={filteredDropPrograms} />
      </div>
    </div>
  );
};

export default SpecificSearchResult;
