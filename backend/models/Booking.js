const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  from: String,
  to: String,
  weight: String,
  price: Number,

  origin: {
    lat: Number,
    lng: Number,
  },
  destination: {
    lat: Number,
    lng: Number,
  },
  currentLocation: {
    lat: Number,
    lng: Number,
  },

  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  status: {
    type: String,
    enum: ["Pending", "Assigned", "In Transit", "Delivered"],
    default: "Pending",
  },

  // 🔥 NEW
  status: {
    type: String,
    default: "Pending",
  },

  trackingId: {
    type: String,
    unique: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);