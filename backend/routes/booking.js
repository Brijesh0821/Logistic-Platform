const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// ✅ ALL IMPORTS (FIXED)
const {
  createBooking,
  getBookings,
  trackBooking,
  updateStatus,
  getDriverBookings,   // 🔥 IMPORTANT FIX
  getAllBookings,
  assignDriver,
} = require("../controllers/bookingController");


// 🔒 CREATE BOOKING
router.post("/", auth, createBooking);

// 🔒 USER BOOKINGS
router.get("/", auth, getBookings);

// 🔍 TRACKING (PUBLIC)
router.get("/track/:id", trackBooking);

// 🚚 DRIVER BOOKINGS
router.get("/driver", getDriverBookings);

// 📊 ADMIN: GET ALL BOOKINGS
router.get("/all", auth, admin, getAllBookings);

router.put("/assign/:id", auth, admin, assignDriver);

// 🔧 ADMIN: UPDATE STATUS
router.put("/:id", auth, admin, updateStatus);

router.put("/assign/:id", assignDriver);

module.exports = router;