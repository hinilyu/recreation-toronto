import { connectToDB } from "@utils/database";
import Reminder from "@models/reminder";
import RegisteredProgram from "@models/registered_program";
import User from "@models/user";

export const POST = async (req, res) => {
  const { userID } = await req.json();

  await connectToDB();

  const reminders = await Reminder.find({ user: userID });

  const programPromises = reminders.map(async (reminder) => {
    const program = await RegisteredProgram.findOne({ Course_ID: reminder.program });
    const resultObject = {
      ...program.toObject(),
      reminderID: reminder._id,
      reminderStatus: reminder.status,
    };
    return resultObject;
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
    } else {
      const user = await User.findById(userID);

      if (!user) {
        return new Response("User does not exist", { status: 404 });
      }
      user.wishlist_count -= 1;
      await user.save();
    }

    return new Response(JSON.stringify(deletedReminder), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Not able to delete", { status: 500 });
  }
};
