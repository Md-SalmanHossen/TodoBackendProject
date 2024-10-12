const mongoose = require("mongoose");

const dataSchema = mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    EmailAddress: {
      type: String,
      required: true,
    },
    MobileNumber: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique:true
    },
  },
  { versionKey: false }
);

const ProfileModel = mongoose.model("Profiles", dataSchema);
module.exports = ProfileModel;
