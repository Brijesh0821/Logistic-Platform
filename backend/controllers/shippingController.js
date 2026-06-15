const { getRates } = require("../services/shippingService");
const { compareCouriers, predictDelay } = require("../services/logisticsIntelligence");

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

exports.compareCourierRates = (req, res) => {
  const result = compareCouriers(req.body);
  res.json({
    ...result,
    delayPrediction: predictDelay({
      ...req.body,
      chargeableWeight: result.weightAnalysis.chargeableWeight,
      weightMismatch: result.weightAnalysis.mismatch,
    }),
  });
};
