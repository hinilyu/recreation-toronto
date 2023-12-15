import { Schema, model, models } from "mongoose";

const ReminderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: "RegisteredProgram",
  },
  status: {
    type: String,
  },
});

const Reminder = models.Reminder || model("Reminder", ReminderSchema);

export default User;
