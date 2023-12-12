"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

const RegisteredProgramPage = ({ params }) => {
  const [program, setProgram] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchProgram = async () => {
    const response = await fetch(`/api/programs/registered?id=${params.id}`);
    const data = await response.json();
    setProgram(data);
    setIsLoaded(true);
    console.log(data);
  };

  useEffect(() => {
    if (params.id) {
      fetchProgram();
    }
  }, []);

  // handle datetime
  const startDate = new Date(program["Start Date"]);
  startDate.setDate(startDate.getDate() + 1);
  const regDate = new Date(program["Registration Date"]);
  regDate.setDate(regDate.getDate() + 1);
  const nrregDate = new Date(regDate);
  nrregDate.setDate(regDate.getDate() + 10);
  const month = ["Jan", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
    "M, W, F": "Mon, Wed and Fri",
    "Su, W, Th, F, Sa": "Wed to Sun",
    "Su, F, Sa": "Sat to Fri",
  };
  var startMin = "";
  var endMin = "";
  if (program["Start Min"] < 10) {
    startMin = "0" + program["Start Min"];
  } else {
    startMin = program["Start Min"];
  }
  if (program["End Min"] < 10) {
    endMin = "0" + program["End Min"];
  } else {
    endMin = program["End Min"];
  }
  // handle status
  var status = "";
  var style = "";
  if (program["Status / Information"] === "This course has started") {
    status = "Course Started";
    style = "absolute right-8 top-8 border-2 rounded px-2 py-1 text-indigo-700 border-indigo-700 text-xs md:text-base";
  } else if (program["Status / Information"] === "This course is not presently available for Internet Registration.") {
    status = "Internet Registration Not Available";
    style = "absolute right-8 top-8 border-2 rounded px-2 py-1 text-orange-700 border-orange-700 text-xs md:text-base";
  } else if (program["Status / Information"] === "This course is open for registration") {
    status = "Open for Registration";
    style = "absolute right-8 top-8 border-2 rounded px-2 py-1 text-lime-600 border-lime-600 text-xs md:text-base";
  }
  if (!isLoaded) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Paper className="sm:mt-10 mt-5 font-inter ">
        <div className="relative max-w-7xl md:w-[80vw] w-[90dvw] min-h-[80dvh] md:min-h-[700px] lg:min-h-[800px] p-10 mb-10">
          {/* Status */}
          <button disabled className={style}>
            {status}
          </button>
          {/* Title */}
          <h1 className="font-light text-xl md:mt-20 mt-10">{program["Activity Title"]}</h1>
          <h1 className="font-bold text-3xl ">{program["Course Title"]}</h1>
          {/* Location */}
          <h3 className="md:text-lg text-sm bg-slate-200 hover:bg-slate-300 inline-block py-1 px-3 rounded mt-1">
            <Link target="_blank" href={`https://www.toronto.ca/data/parks/prd/facilities/complex/${program["Location ID"]}/index.html`}>
              {program["Asset Name"]}
            </Link>
          </h3>
          {/* Datetime */}
          <h3 className="mt-5 font-light">
            Every
            <span className="font-medium ms-1 me-1">{weekday[program["Days of The Week"]]}</span>
            {`from ${program["From To"]}`}
          </h3>
          <h3 className="text-lg">{`${program["Start Hour"]}:${startMin} - ${program["End Hour"]}:${endMin}`}</h3>
          {/* Link */}
          <Link href={program["eFun URL"]}>
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 border border-orange-700 rounded text-sm mt-5">
              View on eFun
            </button>
          </Link>
          <div className="font-light leading-7">
            {/* Fee */}
            <h3 className="mt-10">
              <span className="font-medium">Fees:</span>
            </h3>
            <h3>
              <span className="font-medium">Non-Resident Fees:</span>
            </h3>
            {/* Age */}
            {program["Max Age"] === "None" ? (
              <h3 className="">
                <span className="font-medium">Age: </span>
                {`${program["Min Age"] / 12} Yrs. and over`}
              </h3>
            ) : (
              <h3 className="">
                <span className="font-medium">Age: </span>
                {`${program["Min Age"] / 12} Yrs. to ${program["Max Age"] / 12} Yrs.`}
              </h3>
            )}
            {/* Description */}
            <p className="font-satoshi text-sm md:text-base my-8 ms-5 " dangerouslySetInnerHTML={{ __html: program["Activity Description"] }}></p>
            {/* Datetime */}
            <h3 className="mt-3">
              <span className="font-medium">Program Start Date: </span>
              {`${month[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`}
            </h3>
            <h3 className="mt-3">
              <span className="font-medium">Registration Date: </span>
              {`${month[regDate.getMonth()]} ${regDate.getDate()}, ${regDate.getFullYear()} 7:00AM`}
            </h3>
            <h3>
              {" "}
              <span className="font-medium">Non-Resident Registration Date: </span>
              {`${month[nrregDate.getMonth()]} ${nrregDate.getDate()}, ${nrregDate.getFullYear()} 7:00AM`}
            </h3>

            <h3>
              <span className="font-medium">Spots Available:</span>
            </h3>
          </div>
          <br></br>
        </div>
      </Paper>
    </div>
  );
};

export default RegisteredProgramPage;
