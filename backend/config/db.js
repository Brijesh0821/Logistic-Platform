const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    console.error("DB Error: MONGO_URI is missing in backend/.env");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      tls: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Error:", err.message);

    if (
      err.message?.includes("SSL") ||
      err.message?.includes("TLS") ||
      err.message?.includes("tlsv1 alert internal error")
    ) {
      console.error(
        "MongoDB TLS connection failed. Check that backend/.env has the correct Atlas URI, your current IP is allowed in Atlas Network Access, and the cluster is active."
      );
    }
  }
};

module.exports = connectDB;
