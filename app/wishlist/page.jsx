"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Fragment } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";

const Wishlist = () => {
  const { data: session, status } = useSession();

  if (!session?.user) {
    return <div className="mt-5 font-inter">You need to login first</div>;
  }

  const [programs, setPrograms] = useState([]);

  //Snackbar
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const vertical = "top";
  const horizontal = "center";
  const now = new Date();

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

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: session?.user.id,
        }),
      });
      const data = await response.json();
      data.sort((a, b) => new Date(a["Registration Date"]) - new Date(b["Registration Date"]));
      console.log(data);
      setPrograms(data);
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();

  const handleRedirect = (url, e) => {
    e.stopPropagation();
    const newTab = window.open(url, "_blank");
    if (newTab) {
      newTab.focus();
    } else {
      router.push(url);
    }
  };

  const handleRemind = async (reminderID, e) => {
    e.stopPropagation();
    try {
      const response = await fetch("/api/add-reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reminderID,
        }),
      });
      console.log(response);
      if (response.status === 200) {
        fetchWishlist();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReminder = async (programID, e) => {
    e.stopPropagation();
    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: session?.user.id,
          programID,
        }),
      });

      if (response.status === 200) {
        setOpenSuccess(true);
      } else {
        setErrorMsg("Could not delete this reminder. Please try again.");
        setOpenError(true);
      }
      fetchWishlist();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchWishlist();
    }
  }, [status, session]);

  return (
    <section className="w-full">
      <h1 className="text-2xl font-bold text-black sm:text-3xl text-start mt-3">My Wishlist</h1>
      <TableContainer component={Paper} className="mt-5">
        <Table sx={{ minWidth: 650 }} aria-label="wishlist">
          <TableHead>
            <TableRow>
              <TableCell className="font-satoshi font-bold">Program Title</TableCell>
              <TableCell align="right" className="font-satoshi font-bold">
                Registration Date
              </TableCell>

              <TableCell align="right" className="font-satoshi font-bold">
                Spots Available
              </TableCell>
              <TableCell align="center" className="font-satoshi font-bold">
                Status
              </TableCell>
              <TableCell align="center" className="font-satoshi font-bold">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((program) => {
              // handle datetime
              const regDate = new Date(program["Registration Date"]);
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

              if (program["Start Min"] < 10) {
                startMin = "0" + program["Start Min"];
              } else {
                startMin = program["Start Min"];
              }

              // handle status
              var status = "";
              var style = "";
              if (program["Status / Information"] === "This course has started") {
                status = "Course Started";
                style = "border rounded p-1 text-indigo-700 border-indigo-700 text-xs md:text-sm";
              } else if (program["Status / Information"] === "This course is not presently available for Internet Registration.") {
                status = "Internet Registration Not Available";
                style = "border rounded py-1 text-orange-700 border-orange-700 text-xs md:text-sm";
              } else if (program["Status / Information"] === "This course is open for registration") {
                status = "Open for Registration";
                style = "border rounded py-1 text-lime-600 border-lime-600 text-xs md:text-sm";
              }
              return (
                <TableRow
                  key={program["Course_ID"]}
                  className="hover:bg-slate-100 hover:cursor-pointer"
                  onClick={(e) => handleRedirect(`/programs/registered/${program["Course_ID"]}`, e)}
                >
                  <TableCell className="font-satoshi md:text-base ">
                    {program["Course Title"]}{" "}
                    <span className="text-xs md:text-sm text-orange-800">{`${weekday[program["Days of The Week"]]} ${
                      program["Start Hour"]
                    }:${startMin}`}</span>
                  </TableCell>
                  <TableCell align="right" className="font-satoshi md:text-base">
                    <span>
                      <div>
                        {`${month[regDate.getUTCMonth()]} ${regDate.getUTCDate()}`}
                        <span className="hidden lg:inline">, {regDate.getUTCFullYear()}</span>
                      </div>
                      {program.reminderStatus === "wishlist" && regDate > now ? (
                        <button
                          onClick={(e) => handleRemind(program.reminderID, e)}
                          className="border border-orange-300 bg-orange-400 text-white rounded px-1 hover:bg-transparent hover:text-orange-500 text-sm md:text-base"
                        >
                          Remind Me
                        </button>
                      ) : (
                        ""
                      )}
                      {program.reminderStatus === "reminder" && regDate > now ? (
                        <button disabled className="border border-green-500 bg-green-600 text-white rounded px-1 text-xs">
                          1 Day Reminder Set
                        </button>
                      ) : (
                        ""
                      )}
                      {/* {program.reminderStatus === "reminded" ? (
                        <button
                          onClick={() => handleRemind(program.reminderID)}
                          className="border border-purple-300 bg-purple-500 text-white rounded px-1 text-xs"
                        >
                          Reminder Sent
                        </button>
                      ) : (
                        ""
                      )} */}
                    </span>
                  </TableCell>

                  <TableCell className="font-satoshi md:text-base" align="right">
                    {program["Spots Available"] >= 0 ? program["Spots Available"] : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    <div className={style}>{status}</div>
                  </TableCell>
                  <TableCell align="right">
                    <span>
                      <Button
                        onClick={(e) => {
                          handleRedirect(program["eFun URL"], e);
                        }}
                      >
                        <OpenInNewIcon />
                      </Button>

                      <Button
                        onClick={(e) => {
                          deleteReminder(program["Course_ID"], e);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} action={action}>
        <Alert onClose={handleClose} severity="warning">
          {errorMsg}
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} action={action}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Reminder deleted
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Wishlist;
