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

  // create reminder
  const newReminder = new Reminder({
    user: user._id,
    program: programObject["Course_ID"],
    status: "created",
  });

  newReminder
    .save()
    .then((savedReminder) => {})
    .catch((error) => {
      console.log(error);
    });

  const regDate = new Date(program["Registration Date"]);
  regDate.setDate(regDate.getDate() + 1);
  const month = ["Jan", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // send confirmation email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: `Reminder Created: ${programObject["Course Title"]}`,
    text: `You have successfully set up a reminder on the program ${program["Activity Title"]}: ${program["Course Title"]} \n \
    \n \
    The registration date is ${month[regDate.getMonth()]} ${regDate.getDate()}, ${regDate.getFullYear()} 7:00AM\n \
    \n \
    We will remind you again 1 day before the registration starts.
    \n \
    Note: Registration date for non-resident will be 10 days later than the above date
    \n \
    \n \
    Thank you for using our service
    \n \
    https://recreation-toronto.vercel.app/
    
`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`sent to ${email}`);
      return new Response("Success", { status: 200 });
    }
  });

  return new Response("Success", { status: 201 });
};
