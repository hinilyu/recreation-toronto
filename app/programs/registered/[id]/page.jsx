"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Fragment } from "react";
import { useSession } from "next-auth/react";
import Tooltip from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const RegisteredProgramPage = ({ params }) => {
  const [program, setProgram] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: session } = useSession();
  const now = new Date();

  const handleRemind = () => {
    // if (regDate <= now) {
    //   setErrorMsg("Program's registration period already started");
    //   setOpenError(true);
    //   return;
    // }
    if (session?.user) {
      addWishlist();
    } else {
      setErrorMsg("You need to login first.");
      setOpenError(true);
    }
  };

  //Snackbar
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const vertical = "top";
  const horizontal = "center";

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
    setOpenSuccess(false);
  };

  const action = (
    <Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  // handle addWishlist
  const addWishlist = async () => {
    try {
      const response = await fetch("/api/add-wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          program: program,
        }),
      });
      const data = response;
      if (data.status === 400) {
        setErrorMsg("Program already added to wishlist");
        setOpenError(true);
      } else if (data.status === 404) {
        setErrorMsg("Error: Program not found / User does not exist");
        setOpenError(true);
      } else if (data.status === 201) {
        setOpenSuccess(true);
      } else if (data.status === 409) {
        setErrorMsg("You have reached the maximum wishlist items. Delete some before subscribing to new ones.");
        setOpenError(true);
      }
    } catch (error) {}
  };

  const fetchProgram = async () => {
    const response = await fetch(`/api/programs/registered?id=${params.id}`);
    if (response.status !== 200) {
    }
    const data = await response.json();
    setProgram(data);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (params.id) {
      fetchProgram();
    }
  }, []);

  // handle datetime
  const startDate = new Date(program["Start Date"]);
  const regDate = new Date(program["Registration Date"]);
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
    "Tu, W, Th": "Tue to Thu",
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

  //handle fees
  const fees = program.Fees;
  var feeArray = ["N/A", "N/A"];

  if (fees) {
    // Remove the square brackets and quotes from the string
    const cleanedString = fees.replace(/[\[\]"']/g, "");

    // Split the cleaned string into an array
    feeArray = cleanedString.split(", ");
  }

  // handle status
  var status = "";
  var style = "";
  if (program["Status / Information"] === "This course has started") {
    status = "Course Started";
    style = "absolute sm:right-8 top-4 right-4 sm:top-8 border-2 rounded px-2 py-1 text-indigo-700 border-indigo-700 text-xs md:text-base";
  } else if (program["Status / Information"] === "This course is not presently available for Internet Registration.") {
    status = "Internet Registration Not Available";
    style = "absolute sm:right-8 top-4 right-4 sm:top-8 border-2 rounded px-2 py-1 text-orange-700 border-orange-700 text-xs md:text-base";
  } else if (program["Status / Information"] === "This course is open for registration") {
    status = "Open for Registration";
    style = "absolute sm:right-8 top-4 right-4 sm:top-8 border-2 rounded px-2 py-1 text-lime-600 border-lime-600 text-xs md:text-base";
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
          <h1 className="font-light text-xl md:mt-12 mt-6">{program["Activity Title"]}</h1>
          <h1 className="font-bold text-3xl ">{program["Course Title"]}</h1>
          {/* Location */}
          <h3 className="md:text-lg sm:text-sm text-xs bg-slate-200 hover:bg-slate-300 inline-block sm:py-1 sm:px-3 rounded mt-1">
            <Link target="_blank" href={`https://www.toronto.ca/data/parks/prd/facilities/complex/${program["Location ID"]}/index.html`}>
              {program["Asset Name"]}
            </Link>
          </h3>
          {/* Datetime */}
          <h3 className="mt-5 font-light sm:text-base text-sm">
            Every
            <span className="font-medium ms-1 me-1">{weekday[program["Days of The Week"]]}</span>
            {`from ${program["From To"]}`}
          </h3>
          <h3 className="text-lg">{`${program["Start Hour"]}:${startMin} - ${program["End Hour"]}:${endMin}`}</h3>
          {/* Link */}
          <div className="flex">
            <Link href={program["eFun URL"]}>
              <button className="bg-blue-500 hover:bg-orange-700 text-white font-bold py-2 px-4 border border-blue-700 rounded text-xs md:text-sm mt-5">
                Register on eFun
              </button>
            </Link>
            {regDate <= now ? (
              <button
                onClick={handleRemind}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 border border-orange-700 rounded text-xs md:text-sm mt-5 ms-5"
              >
                Add to Wishlist
              </button>
            ) : (
              <button
                onClick={handleRemind}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 border border-orange-700 rounded text-xs md:text-sm mt-5 ms-5"
              >
                Add to Wishlist
              </button>
            )}
          </div>

          <div className="font-light leading-7">
            {/* Fee */}
            <h3 className="mt-10">
              <span className="font-medium">
                Resident: <span className="font-light">{feeArray[0] === "$0.00" ? "Free" : feeArray[0]}</span>{" "}
                <span className="sm:hidden">
                  <br></br>
                </span>
                <span className="hidden sm:inline"> | </span>
                Non-Resident:
                <span className="font-light"> {feeArray[1]}</span>
              </span>
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
              {`${month[startDate.getUTCMonth()]} ${startDate.getUTCDate()}, ${startDate.getUTCFullYear()}`}
            </h3>
            <h3 className="mt-3">
              <span className="font-medium">Registration Date: </span>
              {`${month[regDate.getUTCMonth()]} ${regDate.getUTCDate()}, ${regDate.getUTCFullYear()} 7:00AM`}{" "}
            </h3>
            <h3>
              <span className="font-medium">Non-Resident Registration Date: </span>
              {`${month[nrregDate.getUTCMonth()]} ${nrregDate.getUTCDate()}, ${nrregDate.getUTCFullYear()} 7:00AM`}
            </h3>

            <h3 className="mt-3">
              <span className="font-medium">
                Spots Available: <span className="font-light">{program["Spots Available"] >= 0 ? program["Spots Available"] : "N/A"}</span>
              </span>
            </h3>
          </div>
          <br></br>
        </div>
      </Paper>
      <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} action={action}>
        <Alert onClose={handleClose} severity="warning">
          {errorMsg}
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} action={action}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Program added to wishlist!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RegisteredProgramPage;
