import { Schema, model, models } from "mongoose";

const ReminderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  program: {
    type: Number,
  },
  status: {
    type: String,
  },
});

const Reminder = models.Reminder || model("Reminder", ReminderSchema);

export default Reminder;
