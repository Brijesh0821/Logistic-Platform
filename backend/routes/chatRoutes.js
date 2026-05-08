const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const message = String(req.body?.message || "").trim();

  if (!message) {
    return res.status(400).json({ reply: "Please type a message." });
  }

  const msg = message.toLowerCase();

  const responses = [
    {
      keywords: ["hi", "hello"],
      reply: "Hello! Welcome to SwiftLogix. How can I help you?",
    },
    {
      keywords: ["price", "cost", "rate"],
      reply: "Pricing depends on distance and weight. Use our Rate Calculator.",
    },
    {
      keywords: ["track", "tracking"],
      reply: "You can track shipment using the tracking ID on the Tracking page.",
    },
    {
      keywords: ["delivery", "time"],
      reply: "Delivery usually takes 2-5 business days.",
    },
    {
      keywords: ["payment"],
      reply: "We support UPI, cards, and net banking.",
    },
    {
      keywords: ["cancel"],
      reply: "You can cancel a booking from your dashboard.",
    },
    {
      keywords: ["refund"],
      reply: "Refunds are usually processed within 3-5 days.",
    },
    {
      keywords: ["book", "booking"],
      reply: "Go to the Booking page to create a shipment.",
    },
    {
      keywords: ["support", "help"],
      reply: "Contact support at support@swiftlogix.com",
    },
    {
      keywords: ["truck", "vehicle"],
      reply: "We provide mini trucks, containers, and heavy vehicles.",
    },
  ];

  let reply = "I can help with pricing, tracking, booking, and delivery.";

  for (const item of responses) {
    if (item.keywords.some((keyword) => msg.includes(keyword))) {
      reply = item.reply;
      break;
    }
  }

  res.json({ reply });
});

module.exports = router;
