import DropinProgram from "@models/dropin";
import Location from "@models/location";
import { connectToDB } from "@utils/database";

// Function to calculate distance between two sets of coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // deg2rad below
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = 0.5 - Math.cos(dLat) / 2 + (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export async function POST(req, res) {
  const { lat, lng, useCurrentLocation, all } = await req.json();

  await connectToDB();

  let today = new Date();
  let weeklater = new Date();
  weeklater.setDate(today.getDate() + 7);

  // if coordinates are provided
  if (lat && lng && useCurrentLocation) {
    try {
      const closestLocations = await Location.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: "distance",
            spherical: true,
          },
        },
        { $limit: 2 },
      ]);

      const locationIds = closestLocations.map((location) => location["Location ID"]);

      const randomPrograms = await DropinProgram.aggregate([
        {
          $match: {
            "Location ID": { $in: locationIds },
            "Start Date Time": { $gte: today.toJSON(), $lt: weeklater.toJSON() },
          },
        },
        {
          $lookup: {
            from: "locations", // Adjust the collection name if needed
            localField: "Location ID",
            foreignField: "Location ID",
            as: "locationDetails",
          },
        },
        {
          $sort: {
            "Start Date Time": 1, // 1 for ascending order, -1 for descending order
          },
        },
      ]);

      const programsWithDistance = randomPrograms.map((program) => {
        const programLocation = program.locationDetails[0].Coordinates;
        program.distance = Math.round(calculateDistance(lat, lng, programLocation[1], programLocation[0]) * 10) / 10;
        return program;
      });

      return new Response(JSON.stringify(programsWithDistance), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  } else {
    //show random program
    try {
      const result = await DropinProgram.aggregate([
        {
          $match: {
            "Start Date Time": { $gte: today.toJSON(), $lt: weeklater.toJSON() },
          },
        },
        { $sample: { size: 20 } },
        {
          $sort: {
            "Start Date Time": 1, // 1 for ascending order, -1 for descending order
          },
        },
        {
          $lookup: {
            from: "locations", // Adjust the collection name if needed
            localField: "Location ID",
            foreignField: "Location ID",
            as: "locationDetails",
          },
        },
      ]);

      return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  return new Response("Internal Server Error", { status: 404 });
}
