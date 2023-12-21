import { connectToDB } from "@utils/database";
import Reminder from "@models/reminder";
import RegisteredProgram from "@models/registered_program";
import User from "@models/user";
import nodemailer from "nodemailer";

export async function GET(req) {
  const now = new Date();

  await connectToDB();
  console.log("running scheduled task");

  const reminders = await Reminder.find();

  for (const reminder of reminders) {
    try {
      const program = await RegisteredProgram.findOne({ Course_ID: reminder.program });

      if (reminder.status === "reminded") {
        continue;
      }

      if (!program) {
        console.error("Program not found for reminder:", reminder);
        continue; // Skip to the next reminder if program is not found
      }

      const regDate = new Date(program["Registration Date"]);
      const month = ["Jan", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      if (!regDate) {
        console.error("Invalid registration date for program:", program);
        continue; // Skip to the next reminder if registration date is missing or invalid
      }

      const user = await User.findById(reminder.user);

      if (!user) {
        console.error("User not found for reminder:", reminder);
        continue; // Skip to the next reminder if user is not found
      }

      // check if registration day is one day from today
      const isOneDayBefore =
        regDate.getUTCDate() === now.getUTCDate() + 1 &&
        regDate.getUTCMonth() === now.getUTCMonth() &&
        regDate.getUTCFullYear() === now.getUTCFullYear();

      if (isOneDayBefore) {
        // if true, use nodemailer to send an email to remind the user of the registration
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.MAIL_USER,
          to: user.email, // replace with the actual user's email
          subject: `Reminder: Program Registration Tomorrow - ${program["Course Title"]}`,
          html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <img src="https://recreation-toronto.vercel.app/assets/images/logo.png" alt="Recreation Toronto Logo" style="max-width: 135px; height: auto;">
            <p style="margin-top: 15px; font-size: 16px;">Hello,</p>
            <p style="margin-top: 15px; font-size: 16px;">Don't forget to register for the program <a href="${`https://recreation-toronto.vercel.app/programs/registered/${program["Course_ID"]}`}" style="color: #007BFF; text-decoration: underline;">${
            program["Activity Title"]
          }: ${program["Course Title"]}</a> tomorrow.</p>
            <p style="margin-top: 15px; font-size: 16px;">The registration date is ${
              month[regDate.getUTCMonth()]
            } ${regDate.getUTCDate()}, ${regDate.getUTCFullYear()} at 7:00 AM.</p>
           <br/><br/>
            <p style="margin-top: 15px; font-size: 14px;">Note: Registration date for non-residents will be 10 days later than the above date.</p>
            <br>
            <a href="${
              program["eFun URL"]
            }" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #ff9800; color: #000000; text-decoration: none; border-radius: 5px; margin-top: 15px;">Click Here to Register</a>
            <br/><br/><br/>
          </div>
        `,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`Email sent: ${info.response}`);
      }

      // mark the reminder status as reminded
      reminder.status = "reminded";
      await reminder.save();
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify(error), { status: 500 });
    }
  }

  return new Response("All Email Sent", { status: 200 });
}
