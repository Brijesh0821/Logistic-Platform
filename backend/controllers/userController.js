const User = require("../models/User");

// 🔥 GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ msg: "Error fetching profile" });
  }
};

// 🔥 UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, company } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, company },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch {
    res.status(500).json({ msg: "Error updating profile" });
  }
};