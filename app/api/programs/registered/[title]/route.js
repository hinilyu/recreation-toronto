import { connectToDB } from "@utils/database";
import RegisteredProgram from "@models/registered_program";
import Location from "@models/location";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const title = params.title;

    const programs = await RegisteredProgram.find({ "Course Title": title });
    const locationIds = programs.map((program) => program["Location ID"]);
    const locations = await Location.find({ "Location ID": { $in: locationIds } });

    // Combine programs and locations as needed
    const result = programs.map((program) => {
      const location = locations.find((loc) => loc["Location ID"] === program["Location ID"]);
      return {
        program,
        location,
      };
    });

    if (!programs) return new Response("Program not found", { status: 404 });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch this program", { status: 500 });
  }
};
