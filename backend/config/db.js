const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

const dbState = {
  connected: false,
  lastError: null,
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    console.error("DB Error: MONGO_URI is missing in backend/.env");
    dbState.connected = false;
    dbState.lastError = "MONGO_URI is missing";
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      tls: true,
    });
    dbState.connected = true;
    dbState.lastError = null;
    console.log("MongoDB Connected");
    return true;
  } catch (err) {
    dbState.connected = false;
    dbState.lastError = err.message;
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

    return false;
  }
};

mongoose.connection.on("connected", () => {
  dbState.connected = true;
  dbState.lastError = null;
});

mongoose.connection.on("disconnected", () => {
  dbState.connected = false;
});

mongoose.connection.on("error", (err) => {
  dbState.connected = false;
  dbState.lastError = err.message;
});

connectDB.state = dbState;

module.exports = connectDB;
