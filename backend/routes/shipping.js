const express = require("express");
const router = express.Router();

const { calculateRate } = require("../controllers/shippingController");

router.post("/rate", calculateRate);

module.exports = router;