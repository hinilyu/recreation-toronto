// api/scheduled-task.js

export default async function handler(req, res) {
  console.log("Executing scheduled task...");

  // Your task logic here
  // e.g., check for upcoming program registrations and send reminders

  res.status(200).json({ success: true });
}
