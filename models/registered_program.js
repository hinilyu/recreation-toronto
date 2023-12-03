import { Schema, model, models } from "mongoose";

const RegisteredProgramSchema = new Schema({
  _id: {
    type: "Number",
  },
  Course_ID: {
    type: "Number",
  },
  "Location ID": {
    type: "Number",
  },
  "Activity Title": {
    type: "String",
  },
  "Course Title": {
    type: "String",
  },
  "Activity Description": {
    type: "String",
  },
  "Days of The Week": {
    type: "String",
  },
  "From To": {
    type: "String",
  },
  "Start Hour": {
    type: "Number",
  },
  "Start Min": {
    type: "Number",
  },
  "End Hour": {
    type: "Number",
  },
  "End Min": {
    type: "Number",
  },
  "Start Date": {
    $date: {
      type: "Date",
    },
  },
  "eFun URL": {
    type: "String",
  },
  "Min Age": Schema.Types.Mixed,
  "Max Age": Schema.Types.Mixed,
  "Program Category": {
    type: "String",
  },
  "Registration Date": {
    $date: {
      type: "Date",
    },
  },
  "Status / Information": {
    type: "String",
  },
});

const RegisteredProgram = models.RegisteredProgram || model("RegisteredProgram", RegisteredProgramSchema);

export default RegisteredProgram;
