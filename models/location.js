import { Schema, model, models } from "mongoose";

const LocationSchema = new Schema({
  _id: {
    type: "Number",
  },
  "Facility ID": {
    type: "Number",
  },
  "Location ID": {
    type: "Number",
  },
  "Facility Type (Display Name)": {
    type: "String",
  },
  FacilityType: {
    type: "String",
  },
  "Asset Name": {
    type: "String",
  },
  Address: {
    type: "String",
  },
  Coordinates: {
    type: ["Number"],
  },
  Confidence: {
    type: "Number",
  },
});

const Location = models.Location || model("Location", LocationSchema);

export default Location;
