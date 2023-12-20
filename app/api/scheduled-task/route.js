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

  reminders.forEach(async (reminder) => {
    try {
      // get program registration date
      const program = await RegisteredProgram.findOne({ Course_ID: reminder.program });
      const regDate = new Date(program["Registration Date"]);
      // get user email
      const user = await User.findById(reminder.user);

      // check if registration day is one day from today
      const isOneDayBefore = regDate.getDate() <= now.getDate() - 1;

      if (isOneDayBefore && reminder.status !== "reminded") {
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
                  <style>
                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                  body {
                    font-family: 'Inter', sans-serif;
                  }
                  .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #ff9800; /* Orange color */
                    color: #ffffff; /* White text */
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 15px;
                  }
                </style>
                <img src="cid:logo" alt="Recreation Toronto" >
                <p>Hello,</p>
                <p>Don't forget to register for the program <a href="${`http://localhost:3000/programs/registered/${program["Course_ID"]}`}">${
            program["Course Title"]
          }</a> tomorrow.</p><br/>
          <a class="button" href="${program["eFun URL"]}" target="_blank">Click Here to Register</a>
                <br/><br/><br/>
                <p>Regards,<br>Recreation Toronto</p>
                
              `,
          attachments: [
            {
              filename: "logo.svg",
              path: "assets/images/logo.svg",
              cid: "logo", // make sure to use the same CID in the <img src="cid:logo"> tag
            },
          ],
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
  });

  return new Response("All Email Sent", { status: 200 });
}
