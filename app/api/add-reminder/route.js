import { connectToDB } from "@utils/database";
import nodemailer from "nodemailer";
import User from "@models/user";
import RegisteredProgram from "@models/registered_program";
import Reminder from "@models/reminder";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const { reminderID } = await req.json();

    // Check if reminderID is valid
    if (!reminderID) {
      return new Response("Invalid reminderID", { status: 400 });
    }

    // Find reminder
    const reminder = await Reminder.findById(reminderID);
    if (!reminder) {
      return new Response("Reminder not found", { status: 404 });
    }

    // Find program
    const program = await RegisteredProgram.findOne({ Course_ID: reminder.program });
    if (!program) {
      return new Response("Program not found", { status: 404 });
    }

    // Find user
    const user = await User.findById(reminder.user);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const regDate = new Date(program["Registration Date"]);
    const month = ["Jan", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Send confirmation email
    const sendEmail = async () => {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.MAIL_USER,
          to: user.email,
          subject: `Reminder Created: ${program["Course Title"]}`,
          html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <img src="https://recreation-toronto.vercel.app/assets/images/logo.png" alt="Recreation Toronto Logo" style="max-width: 135px; height: auto;">
            <p style="margin-top: 15px; font-size: 16px;">Hello,</p>
            <p style="margin-top: 15px; font-size: 16px;">You have successfully set up a reminder on the program <a href="${`https://recreation-toronto.vercel.app/programs/registered/${program["Course_ID"]}`}" style="color: #007BFF; text-decoration: underline;">${
            program["Activity Title"]
          }: ${program["Course Title"]}</a></p>
            <p style="margin-top: 15px; font-size: 16px;">The registration date is ${
              month[regDate.getUTCMonth()]
            } ${regDate.getUTCDate()}, ${regDate.getUTCFullYear()} at 7:00 AM.</p>
            <p style="margin-top: 15px; font-size: 16px;">We will remind you again 1 day before the registration starts.</p>
            <br/><br/>
            <p style="margin-top: 15px; font-size: 14px;">Note: Registration date for non-residents will be 10 days later than the above date.</p>
            <p style="margin-top: 15px; font-size: 14px;">Thank you for using our service.</p>
            <br>
  
            <a href="https://recreation-toronto.vercel.app/" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #ff9800; color: #000000; text-decoration: none; border-radius: 5px; margin-top: 15px;">Visit our Website</a>
            <br/><br/><br/><br/>
          </div>
        `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Update reminder status
        reminder.status = "reminder";
        await reminder.save();

        return new Response("Success", { status: 200 });
      } catch (error) {
        console.error("Failed to send email:", error);
        return new Response("Failed to send email", { status: 500 });
      }
    };

    // Call sendEmail and return its response
    return await sendEmail();
  } catch (error) {
    console.error("Server Error:", error);
    return new Response("Server Error", { status: 500 });
  }
};
