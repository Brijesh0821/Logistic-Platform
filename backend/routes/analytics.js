const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getDashboardAnalytics } = require("../controllers/analyticsController");

const router = express.Router();
router.get("/dashboard", auth, getDashboardAnalytics);

module.exports = router;
