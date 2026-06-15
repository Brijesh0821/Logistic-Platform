const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  from: String,
  to: String,
  pickupPincode: String,
  dropPincode: String,
  name: String,
  phone: String,
  item: String,
  weight: Number,
  price: Number,
  service: String,
  payment: String,
  dimensions: {
    length: Number,
    breadth: Number,
    height: Number,
  },
  parcelImages: [String],
  selectedCourier: String,
  courierQuotes: [{
    courier: String,
    price: Number,
    estimatedDays: String,
    score: Number,
    bestValue: Boolean,
  }],
  recommendation: {
    courier: String,
    reason: String,
    confidence: Number,
  },
  weightAnalysis: {
    declaredWeight: Number,
    volumetricWeight: Number,
    chargeableWeight: Number,
    discrepancyPercent: Number,
    mismatch: Boolean,
  },
  delayPrediction: {
    onTimeProbability: Number,
    delayProbability: Number,
    riskFactors: [String],
  },
  origin: { lat: Number, lng: Number },
  destination: { lat: Number, lng: Number },
  currentLocation: { lat: Number, lng: Number },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["Pending", "Assigned", "In Transit", "Delivered", "Failed", "Returned"],
    default: "Pending",
  },
  trackingId: { type: String, unique: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
