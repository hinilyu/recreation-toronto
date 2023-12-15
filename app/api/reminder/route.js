import { connectToDB } from "@utils/database";
import nodemailer from "nodemailer";

export const POST = async (req, res) => {
  const { email, program } = await req.json();

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
    subject: `Reminder Set: ${program["Course Title"]}`,
    text: `You have successfully set up a reminder on the program ${program["Activity Title"]}: ${program["Course Title"]} \n \
    \n \
    The registration date is ${month[regDate.getMonth()]} ${regDate.getDate()}, ${regDate.getFullYear()} 7:00AM\n \
    \n \
    We will remind you again a day before the registration start.
    \n \
    \n \
    Remarks: Registration date for non-resident will be 10 days later than the above date`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return new Response("Success", { status: 200 });
    }
  });

  return new Response("Success", { status: 200 });
};
