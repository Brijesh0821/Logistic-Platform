const express = require("express");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  createBooking,
  getBookings,
  trackBooking,
  updateStatus,
  getDriverBookings,
  getAllBookings,
  assignDriver,
} = require("../controllers/bookingController");

const router = express.Router();
router.post("/", auth, createBooking);
router.get("/", auth, getBookings);
router.get("/track/:id", trackBooking);
router.get("/driver", auth, getDriverBookings);
router.get("/all", auth, admin, getAllBookings);
router.put("/assign/:id", auth, admin, assignDriver);
router.put("/:id", auth, admin, updateStatus);

module.exports = router;
