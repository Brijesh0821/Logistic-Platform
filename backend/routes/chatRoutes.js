const express = require("express");
const router = express.Router();

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hasKeyword = (message, keyword) => {
  const cleanKeyword = normalize(keyword);
  if (!cleanKeyword) return false;
  if (message === cleanKeyword) return true;

  const escaped = cleanKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${escaped}(\\s|$)`).test(message);
};

const intents = [
  {
    name: "greeting",
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "namaste"],
    reply: "Hello! I am SwiftLogix support. I can help with tracking, pricing, pickup, delivery delays, payments, refunds, COD, insurance, and account issues.",
    suggestions: ["Track order", "Get price", "Pickup request"],
  },
  {
    name: "thanks",
    keywords: ["thanks", "thank you", "ok", "okay", "great", "done"],
    reply: "You are welcome. I am here if you need help with a shipment, payment, or account issue.",
    suggestions: ["Track order", "Support contact"],
  },
  {
    name: "bye",
    keywords: ["bye", "goodbye", "see you", "talk later"],
    reply: "Goodbye! Have a smooth delivery day. You can reopen chat anytime for SwiftLogix support.",
    suggestions: ["Office timings", "Support contact"],
  },
  {
    name: "tracking",
    keywords: ["track", "tracking", "awb", "order status", "shipment status", "where is my order"],
    reply: "To track an order, open the Tracking page and enter your shipment ID or AWB number. If it has not updated recently, share the ID with support so we can check the latest scan.",
    suggestions: ["Delivery delay", "Delivery ETA"],
  },
  {
    name: "delay",
    keywords: ["delay", "late", "not delivered", "stuck", "missed delivery"],
    reply: "Delivery delays can happen because of route congestion, address issues, weather, or hub scans. Please keep your shipment ID ready; our team can check the current hub and expected movement.",
    suggestions: ["Track order", "Support contact"],
  },
  {
    name: "refund",
    keywords: ["refund", "money back", "charged twice", "return payment"],
    reply: "Refunds are usually initiated after cancellation or failed payment verification and may take 3-7 business days depending on the payment method.",
    suggestions: ["Payment failed", "Cancellation"],
  },
  {
    name: "payment",
    keywords: ["payment", "paid", "failed", "upi", "card", "transaction"],
    reply: "If payment failed but money was deducted, wait a few minutes for automatic reconciliation. Keep the transaction ID ready and contact support if the booking is not confirmed.",
    suggestions: ["Refund issue", "Support contact"],
  },
  {
    name: "pickup",
    keywords: ["pickup", "pick up", "collect", "schedule pickup", "pickup request"],
    reply: "You can create a pickup request from Booking or Dashboard. Add pickup address, contact person, package weight, vehicle need, and preferred time slot.",
    suggestions: ["Vehicle availability", "Shipment pricing"],
  },
  {
    name: "pricing",
    keywords: ["price", "pricing", "rate", "cost", "charges", "shipping charges", "shipment pricing", "calculator"],
    reply: "Pricing depends on distance, weight, vehicle type, service speed, fuel surcharge, GST, handling, insurance, fragile handling, and COD. Use the Smart Price Calculator for a live estimate.",
    suggestions: ["Weight limit", "Insurance", "COD support"],
  },
  {
    name: "weight",
    keywords: ["weight", "weight limit", "heavy", "kg", "ton"],
    reply: "Weight limits depend on the vehicle: bike for light parcels, tempo and mini truck for local loads, trucks for bulk freight, and containers for large commercial shipments.",
    suggestions: ["Vehicle availability", "Shipment pricing"],
  },
  {
    name: "business",
    keywords: ["business account", "company", "corporate", "bulk", "b2b"],
    reply: "Business accounts can manage repeat bookings, company details, shipment history, invoices, and higher-volume logistics requests from the dashboard.",
    suggestions: ["Create account", "Support contact"],
  },
  {
    name: "login",
    keywords: ["login", "signin", "sign in", "password", "reset", "account issue", "cannot login"],
    reply: "For login issues, confirm the registered email and password. Passwords are case-sensitive. If you still cannot access your account, request support with your registered email.",
    suggestions: ["Password reset", "Support contact"],
  },
  {
    name: "contact",
    keywords: ["contact", "support", "call", "email", "helpline", "customer care"],
    reply: "You can contact SwiftLogix support at support@swiftlogix.com. Keep your shipment ID, registered email, and phone number ready for faster help.",
    suggestions: ["Office timings", "Track order"],
  },
  {
    name: "timings",
    keywords: ["office timing", "office timings", "working hours", "open", "closed"],
    reply: "Support is available on business days during standard office hours. Delivery and pickup slots may vary by city, route, and vehicle availability.",
    suggestions: ["Pickup request", "Service areas"],
  },
  {
    name: "international",
    keywords: ["international", "overseas", "export", "import", "customs"],
    reply: "International shipping requires destination country, package contents, invoice details, KYC or business documents, and customs checks. Support can confirm serviceability.",
    suggestions: ["Support contact", "Shipping charges"],
  },
  {
    name: "cancellation",
    keywords: ["cancel", "cancellation", "remove booking"],
    reply: "You can cancel eligible bookings from the dashboard before pickup assignment. Cancellation after dispatch may include route or handling charges.",
    suggestions: ["Refund issue", "Payment failed"],
  },
  {
    name: "cod",
    keywords: ["cod", "cash on delivery", "collect payment"],
    reply: "COD can be enabled for supported shipments. COD fees and settlement timelines depend on the order value, route, and business account settings.",
    suggestions: ["Shipment pricing", "Business account"],
  },
  {
    name: "insurance",
    keywords: ["insurance", "insured", "damage protection", "claim"],
    reply: "Insurance helps protect declared shipment value against eligible loss or damage. Keep invoice details and packaging photos for claim support.",
    suggestions: ["Fragile shipment", "Support contact"],
  },
  {
    name: "fragile",
    keywords: ["fragile", "glass", "breakable", "handle with care"],
    reply: "Fragile shipments should use strong packaging, cushioning, clear labels, and optional insurance. A fragile handling fee may apply.",
    suggestions: ["Insurance", "Shipment pricing"],
  },
  {
    name: "vehicle",
    keywords: ["vehicle", "bike", "tempo", "mini truck", "truck", "container", "availability"],
    reply: "Vehicle availability depends on city and time slot. SwiftLogix supports bike, tempo, mini truck, truck, and container options for different load sizes.",
    suggestions: ["Pickup request", "Weight limit"],
  },
  {
    name: "eta",
    keywords: ["eta", "delivery time", "when deliver", "estimated delivery"],
    reply: "ETA depends on service type: Standard, Express, Same Day, or Overnight. The dashboard and tracking page show the latest shipment movement when available.",
    suggestions: ["Track order", "Delivery delay"],
  },
  {
    name: "areas",
    keywords: ["service area", "service areas", "available city", "pincode", "location"],
    reply: "Serviceability depends on pickup and delivery pincodes, vehicle type, and route coverage. Enter route details during booking or ask support to confirm availability.",
    suggestions: ["Pickup request", "Vehicle availability"],
  },
];

const fallback = {
  reply: "I can help with tracking, delivery delay, refund, payment, pickup, pricing, weight limits, login, COD, insurance, fragile items, vehicles, ETA, and service areas. Could you share a few more details?",
  suggestions: ["Track order", "Shipment pricing", "Support contact"],
};

router.post("/", (req, res) => {
  const message = normalize(req.body?.message);

  if (!message) {
    return res.status(400).json({
      reply: "Please type a message or choose a quick reply.",
      suggestions: ["Track order", "Shipment pricing", "Support contact"],
    });
  }

  const intent = intents.find((item) => item.keywords.some((keyword) => hasKeyword(message, keyword)));

  res.json(intent || fallback);
});

module.exports = router;
