import { connectToDB } from "@utils/database";
import Reminder from "@models/reminder";
import RegisteredProgram from "@models/registered_program";

export const POST = async (req, res) => {
  const { userID } = await req.json();

  await connectToDB();

  const reminders = await Reminder.find({ user: userID });

  const programPromises = reminders.map(async (reminder) => {
    const program = await RegisteredProgram.findOne({ Course_ID: reminder.program });
    return program;
  });

  const programsInWishlist = await Promise.all(programPromises);

  return new Response(JSON.stringify(programsInWishlist), { status: 200 });
};

export const DELETE = async (req, res) => {
  const { userID, programID } = await req.json();

  await connectToDB();

  try {
    const deletedReminder = await Reminder.findOneAndDelete({ user: userID, program: programID });

    if (!deletedReminder) {
      return new Response("Reminder not found", { status: 404 });
    }

    return new Response(JSON.stringify(deletedReminder), { status: 200 });
  } catch (error) {
    return new Response("Not able to delete", { status: 500 });
  }
};
