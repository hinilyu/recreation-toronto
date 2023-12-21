import { connectToDB } from "@utils/database";
import nodemailer from "nodemailer";
import User from "@models/user";
import RegisteredProgram from "@models/registered_program";
import Reminder from "@models/reminder";

export const POST = async (req, res) => {
  const { email, program } = await req.json();

  // check if email exist
  await connectToDB();
  const user = await User.findOne({ email: email });

  if (!user) {
    return new Response("User does not exist", { status: 404 });
  }

  // check program exist
  const programObject = await RegisteredProgram.findOne({ Course_ID: program["Course_ID"] });

  // check program duplicate
  const duplicate = await Reminder.findOne({ user: user._id, program: program["Course_ID"] });

  if (duplicate) {
    return new Response("Program already in wishlist", { status: 400 });
  }

  // check wishlist count limit
  const count = user.wishlist_count;
  if (count >= 20) {
    return new Response("Wishlist limit reached (Maximum is 20)", { status: 409 });
  }

  user.wishlist_count += 1;
  await user.save();

  // create wishlist item
  const newReminder = new Reminder({
    user: user._id,
    program: programObject["Course_ID"],
    status: "wishlist",
  });

  newReminder
    .save()
    .then((savedReminder) => {
      return new Response(JSON.stringify(savedReminder), { status: 201 });
    })
    .catch((error) => {
      console.log(error);
      return new Response("Server Error", { status: 500 });
    });

  return new Response("success", { status: 201 });
};
