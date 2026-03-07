const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide username"],
      maxlength: 100,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    likes: {
      type: String,
      enum: ["entertainment", "sports", "games", "art", "music", "none"],
      default: "none",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Form", FormSchema);
