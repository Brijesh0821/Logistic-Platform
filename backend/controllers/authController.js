const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authStore = require("../services/authStore");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const createToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "swiftlogix-dev-secret",
    { expiresIn: "7d" }
  );

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, company } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = String(phone || "").trim();
    const fullName = String(name || "").trim();
    const companyName = String(company || "").trim();
    const accountRole = ["user", "driver"].includes(role) ? role : "user";

    const errors = {};
    if (!fullName) errors.name = "Full name is required";
    if (!normalizedEmail) errors.email = "Email is required";
    if (normalizedEmail && !emailRegex.test(normalizedEmail)) errors.email = "Enter a valid email address";
    if (!normalizedPhone) errors.phone = "Phone number is required";
    if (normalizedPhone && !/^[6-9]\d{9}$/.test(normalizedPhone)) errors.phone = "Enter a valid 10 digit mobile number";
    if (!password) errors.password = "Password is required";
    if (password && !passwordRegex.test(password)) {
      errors.password = "Password must be at least 8 characters with uppercase, lowercase, and a number";
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({ msg: "Please fix the highlighted fields", errors });
    }

    const exist = await authStore.findByEmail(normalizedEmail);
    if (exist) {
      return res.status(409).json({
        msg: "An account with this email already exists",
        errors: { email: "Email already registered" },
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await authStore.create({
      name: fullName,
      email: normalizedEmail,
      password: hashed,
      role: accountRole,
      phone: normalizedPhone,
      company: companyName,
      isVerified: true,
    });

    res.status(201).json({
      msg: "Account created successfully",
      email: user.email,
      storage: authStore.isMongoConnected() ? "mongo" : "local",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        msg: "An account with this email already exists",
        errors: { email: "Email already registered" },
      });
    }

    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error while creating account" });
  }
};

exports.verifyOtp = async (req, res) => {
  res.status(410).json({
    msg: "OTP verification is currently disabled. Please login with your email and password.",
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const errors = {};
    if (!normalizedEmail) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length) {
      return res.status(400).json({ msg: "Email and password are required", errors });
    }

    const user = await authStore.findByEmail(normalizedEmail);
    if (!user) {
      return res.status(404).json({
        msg: authStore.isMongoConnected()
          ? "No account found with this email"
          : "MongoDB is offline. No local account found with this email. Please register once in this dev environment.",
        errors: { email: "User not found" },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        msg: "Wrong password",
        errors: { password: "Wrong password" },
      });
    }

    if (!user.isVerified) {
      await authStore.markVerified(user);
    }

    res.json({
      msg: "Login successful",
      token: createToken(user),
      storage: authStore.isMongoConnected() ? "mongo" : "local",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error while logging in" });
  }
};
