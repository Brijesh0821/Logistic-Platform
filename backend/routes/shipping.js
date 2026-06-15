const express = require("express");
const router = express.Router();

const { calculateRate, compareCourierRates } = require("../controllers/shippingController");

router.post("/rate", calculateRate);
router.post("/compare", compareCourierRates);

module.exports = router;
