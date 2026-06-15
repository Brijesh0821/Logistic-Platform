const Booking = require("../models/Booking");
const { compareCouriers, predictDelay } = require("../services/logisticsIntelligence");

const generateTrackingId = () => `TRK${Math.floor(100000 + Math.random() * 900000)}`;
const getRandomCoord = () => ({ lat: 20 + Math.random() * 10, lng: 70 + Math.random() * 10 });

exports.createBooking = async (req, res) => {
  try {
    const origin = getRandomCoord();
    const intelligence = compareCouriers(req.body);
    const selected = intelligence.quotes.find((quote) => quote.courier === req.body.selectedCourier) || intelligence.quotes.find((quote) => quote.bestValue);
    const delayPrediction = predictDelay({
      ...req.body,
      chargeableWeight: intelligence.weightAnalysis.chargeableWeight,
      weightMismatch: intelligence.weightAnalysis.mismatch,
    });

    const booking = await Booking.create({
      ...req.body,
      user: req.user.id,
      trackingId: generateTrackingId(),
      price: req.body.price || selected.price,
      selectedCourier: selected.courier,
      courierQuotes: intelligence.quotes,
      recommendation: intelligence.recommendation,
      weightAnalysis: intelligence.weightAnalysis,
      delayPrediction,
      dimensions: {
        length: req.body.length,
        breadth: req.body.breadth,
        height: req.body.height,
      },
      origin,
      destination: getRandomCoord(),
      currentLocation: origin,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: "Booking failed", error: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    res.json(await Booking.find({ user: req.user.id }).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ msg: "Error fetching bookings", error: err.message });
  }
};

exports.trackBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ trackingId: req.params.id });
    if (!booking) return res.status(404).json({ msg: "Tracking ID not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: "Error tracking booking", error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.json({ msg: "Status updated", booking });
  } catch (err) {
    res.status(500).json({ msg: "Error updating status", error: err.message });
  }
};

exports.getAllBookings = async (_req, res) => {
  try {
    res.json(await Booking.find().populate("user", "name email").sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ msg: "Error fetching bookings", error: err.message });
  }
};

exports.getDriverBookings = async (req, res) => {
  try {
    res.json(await Booking.find({ driver: req.user.id }));
  } catch (err) {
    res.status(500).json({ msg: "Error fetching driver bookings", error: err.message });
  }
};

exports.assignDriver = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { driver: req.body.driverId || req.body.driver, status: "Assigned" }, { new: true });
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: "Error assigning driver", error: err.message });
  }
};
