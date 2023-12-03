import { Schema, model, models } from "mongoose";

const DropinProgramSchema = new Schema({
  _id: {
    type: "Number",
  },
  "Location ID": {
    type: "Number",
  },
  Course_ID: {
    type: "Number",
  },
  "Course Title": {
    type: "String",
  },
  "Age Min": Schema.Types.Mixed,
  "Age Max": Schema.Types.Mixed,
  "Date Range": {
    type: "String",
  },
  "Start Date Time": {
    type: "Date",
  },
  "Start Hour": {
    type: "Number",
  },
  "Start Minute": {
    type: "Number",
  },
  "End Hour": {
    type: "Number",
  },
  "End Min": {
    type: "Number",
  },
  Category: {
    type: "String",
  },
  "First Date": {
    $date: {
      type: "Date",
    },
  },
  "Last Date": {
    $date: {
      type: "Date",
    },
  },
});

const DropinProgram = models.DropinProgram || model("DropinProgram", DropinProgramSchema);

export default DropinProgram;
