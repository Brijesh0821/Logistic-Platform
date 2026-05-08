const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

router.get("/me", auth, getProfile);
router.put("/update", auth, updateProfile);

module.exports = router;