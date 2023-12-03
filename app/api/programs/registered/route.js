import { connectToDB } from "@utils/database";
import RegisteredProgram from "@models/registered_program";

export const GET = async (request) => {
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
        },
      },
    ]);

    const mapResult = result.map(({ _id: title, count, description, category }) => ({
      title,
      count,
      description,
      category,
    }));

    return new Response(JSON.stringify(mapResult.slice(0, 20)), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all registered programs", { status: 500 });
  }
};
