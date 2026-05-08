const Booking = require("../models/Booking");

// 🔥 Tracking ID generator
const generateTrackingId = () => {
  return "TRK" + Math.floor(100000 + Math.random() * 900000);
};

// ➕ CREATE BOOKING (SAVE WITH USER + TRACKING)
const getRandomCoord = () => ({
  lat: 20 + Math.random() * 10,
  lng: 70 + Math.random() * 10,
});

exports.createBooking = async (req, res) => {
  try {
    const origin = getRandomCoord();
    const destination = getRandomCoord();

    const booking = new Booking({
      ...req.body,
      user: req.user.id,
      trackingId: generateTrackingId(),

      origin,
      destination,
      currentLocation: origin,
    });

    await booking.save();

    res.json(booking);
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// 📦 GET BOOKINGS (ONLY CURRENT USER)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    });

    res.json(bookings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching bookings" });
  }
};

// 🔍 TRACK BOOKING (PUBLIC)
exports.trackBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      trackingId: req.params.id,
    });

    if (!booking) {
      return res.status(404).json({
        msg: "Tracking ID not found",
      });
    }

    res.json(booking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error tracking booking" });
  }
};

// 🔧 UPDATE STATUS (ADMIN)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.json({
      msg: "Status updated",
      booking,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating status" });
  }
};

// 🔥 ADMIN: GET ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// 🚚 DRIVER BOOKINGS (all active bookings)
exports.getDriverBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      driver: req.user.id,
    });

    res.json(bookings);
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// 🔥 Assign driver
exports.assignDriver = async (req, res) => {
  try {
    const { driver } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        driver,
        status: "Assigned",
      },
      { new: true }
    );

    res.json(booking);
  } catch {
    res.status(500).json({ msg: "Error assigning driver" });
  }
};

exports.assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        driver: driverId,
        status: "Assigned",
      },
      { new: true }
    );

    res.json(booking);

  } catch {
    res.status(500).json({ msg: "Assign failed" });
  }
};