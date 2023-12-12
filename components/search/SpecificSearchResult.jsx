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
    if (searchParams.keyword) {
      const keywords = searchParams.keyword.toLowerCase().trim().split(" ");
      const prog = registeredPrograms.filter((program) => {
        const title = program.title.toLowerCase();
        const description = program.description.toLowerCase();

        // Check if all keywords are present in either title or description
        const allKeywordsPresent = keywords.every((keyword) => title.includes(keyword) || description.includes(keyword));

        return allKeywordsPresent;
      });
      setFilteredPrograms(prog);
    }
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
      <div className="mt-5 font-semibold text-lg"></div>
      <h1 className="section_header">
        Registered Programs on "{searchParams.keyword}"
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
      <h1 className="section_header">
        Drop-in Programs on "{searchParams.keyword}"
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
