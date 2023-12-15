"use client";

import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const ShowLocation = ({ programs, parentCallback }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
  });

  const uniqueIds = new Set();
  const [openID, setOpenID] = useState();

  const handleToggleOpen = (markerID) => {
    setOpenID(markerID);
  };

  const onLoad = async (map) => {
    const bounds = new google.maps.LatLngBounds();
    await programs.forEach(({ location }) => bounds.extend({ lat: location.Coordinates[1], lng: location.Coordinates[0] }));
    map.fitBounds(bounds);
  };

  useEffect(() => {
    if (programs.length === 0) {
      return <div>No Results Found</div>;
    }
  }, []);

  return (
    <div className="w-full h-[80%] sm:p-10 p-3">
      {!isLoaded && programs.length > 0 ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <GoogleMap mapContainerClassName="w-full h-full" onLoad={onLoad}>
          {programs.map((program) => {
            if (!program.location || !program.location._id) {
              // Skip rendering if location or _id is missing
              return "Map function not available";
            }
            // Check if the ID is already seen, if yes, skip rendering
            if (uniqueIds.has(program.location._id)) {
              return null;
            }

            // Mark the ID as seen and render the Marker
            uniqueIds.add(program.location._id);
            return (
              <MarkerF
                key={program.location._id}
                onClick={() => handleToggleOpen(program.location._id)}
                position={{ lat: program.location.Coordinates[1], lng: program.location.Coordinates[0] }}
              >
                {openID === program.location._id ? (
                  <InfoWindowF position={{ lat: program.location.Coordinates[1], lng: program.location.Coordinates[0] }}>
                    <div className="grid justify-center">
                      <h6 className="font-satoshi text-sm font-semibold">{program.location["Asset Name"]}</h6>
                      <div className="flex justify-center mt-3">
                        <button
                          className="bg-transparent hover:bg-blue-500 text-blue-700 text-xs font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                          onClick={() => parentCallback(program.location["Location ID"])}
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </InfoWindowF>
                ) : (
                  ""
                )}
              </MarkerF>
            );
          })}
        </GoogleMap>
      )}
    </div>
  );
};

export default ShowLocation;
