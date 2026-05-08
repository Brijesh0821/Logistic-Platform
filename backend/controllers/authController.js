const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

// 🔐 REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, company } = req.body;

    // check existing
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP is ${otp}. It is valid for 5 minutes.`
    );

    const user = new User({
      name,
      email,
      password: hashed,
      role: role || "user",
      phone,
      company,
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000, // 5 min
    });

    await user.save();

    console.log("OTP:", otp); // 🔥 testing

    res.json({
      msg: "OTP sent",
      email: user.email,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🔐 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;

    await user.save();

    res.json({ msg: "Account verified" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ msg: "Verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};