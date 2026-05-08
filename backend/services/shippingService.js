const axios = require("axios");

// 🔥 BASE CONFIG (PDF से)
const BASE_URL = "https://shipping-api.com/app/api/v1";

const headers = {
  "Content-Type": "application/json",
  public_key: process.env.SHIPPING_PUBLIC_KEY,
  private_key: process.env.SHIPPING_PRIVATE_KEY,
};

// 🚀 RATE CALCULATOR
exports.getRates = async (data) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/rate-calculator`,
      data,
      { headers }
    );

    return res.data;

  } catch (err) {
    console.log("Rate API Error:", err.response?.data || err.message);
    throw err;
  }
};