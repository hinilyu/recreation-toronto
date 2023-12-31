import { connectToDB } from "@utils/database";
import RegisteredProgram from "@models/registered_program";
import Location from "@models/location";

export const GET = async (request) => {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    try {
      await connectToDB();

      const programs = await RegisteredProgram.findOne({ Course_ID: parseInt(id) });
      const locations = await Location.findOne({ "Location ID": programs["Location ID"] });

      if (!programs) return new Response("Program not found", { status: 404 });
      if (!locations) {
        const result = {
          ...programs.toObject(),
          "Asset Name": "Please check on eFun",
        };

        return new Response(JSON.stringify(result), { status: 200 });
      }

      const result = {
        ...programs.toObject(),
        ...locations.toObject(),
      };

      return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
      console.log(error);
      return new Response("Failed to fetch this program", { status: 500 });
    }
  } else {
    try {
      // Process a GET request
      await connectToDB();

      const result = await RegisteredProgram.aggregate([
        {
          $group: {
            _id: "$Course Title",
            count: { $sum: 1 },
            description: { $first: "$Activity Description" },
            category: { $first: "$Program Category" }, // Assuming 'Description' is the same for all occurrences of a title
            daysOfWeek: { $addToSet: "$Days of The Week" }, // Add this line to gather unique days of the week
            minAge: { $min: "$Min Age" }, // Add this line for the lowest min age
            maxAge: { $max: "$Max Age" }, // Add this line for the highest max age
            hasAvailableSpots: { $max: { $gt: ["$Spots Available", 0] } }, // Check if any program has spots available
          },
        },
      ]);

      const mapResult = result.map(({ _id: title, count, description, category, daysOfWeek, minAge, maxAge, hasAvailableSpots }) => ({
        title,
        count,
        description,
        category,
        daysOfWeek,
        minAge,
        maxAge,
        hasAvailableSpots,
      }));

      return new Response(JSON.stringify(mapResult), { status: 200 });
    } catch (error) {
      return new Response("Failed to fetch all registered programs", { status: 500 });
    }
  }
};
