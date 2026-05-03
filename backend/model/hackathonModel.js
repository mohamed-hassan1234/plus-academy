const mongoose = require("mongoose");

const EVENT_TYPES = ["event", "workshop", "hackathon", "graduation"];

const hackathonSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: EVENT_TYPES,
      default: "hackathon",
      index: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationClosedAt: {
      type: Date,
      default: null,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length === 3;
        },
        message: "Exactly 3 images are required",
      },
    },
  },
  { timestamps: true }
);

const Hackathon = mongoose.model("Hackathon", hackathonSchema);

module.exports = Hackathon;
module.exports.EVENT_TYPES = EVENT_TYPES;

