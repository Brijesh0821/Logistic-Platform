const { getRates } = require("../services/shippingService");

// 🔥 GET REAL PRICE
exports.calculateRate = async (req, res) => {
  try {
    const {
      pickup_pincode,
      delivery_pincode,
      weight,
      length,
      breadth,
      height,
    } = req.body;

    const data = {
      pickup_pincode,
      delivery_pincode,
      weight,
      length,
      breadth,
      height,
      payment_type: "prepaid",
    };

    const result = await getRates(data);

    res.json(result);

  } catch (err) {
    res.status(500).json({ msg: "Rate calculation failed" });
  }
};