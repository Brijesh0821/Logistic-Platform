const Booking = require("../models/Booking");

const rank = (map) => Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const bookings = await Booking.find(req.user.role === "admin" ? {} : { user: req.user.id }).lean();
    const delivered = bookings.filter((item) => item.status === "Delivered");
    const mismatches = bookings.filter((item) => item.weightAnalysis?.mismatch).length;
    const failed = bookings.filter((item) => item.status === "Failed").length;
    const returned = bookings.filter((item) => item.status === "Returned").length;
    const riskScore = Math.min(100, mismatches * 18 + failed * 24 + returned * 28);
    const courierMap = {};
    const cityMap = {};
    const monthlyMap = {};

    bookings.forEach((item) => {
      const courier = item.selectedCourier || item.recommendation?.courier || "Unassigned";
      courierMap[courier] = (courierMap[courier] || 0) + 1;
      const city = String(item.to || "Unknown").split(",").pop().trim();
      cityMap[city] = (cityMap[city] || 0) + 1;
      const month = new Date(item.createdAt || item.date).toLocaleString("en", { month: "short" });
      monthlyMap[month] = (monthlyMap[month] || 0) + Number(item.price || 0);
    });

    const couriers = rank(courierMap);
    res.json({
      summary: {
        totalShipments: bookings.length,
        deliveredShipments: delivered.length,
        pendingShipments: bookings.length - delivered.length,
        revenue: bookings.reduce((sum, item) => sum + Number(item.price || 0), 0),
        deliverySuccessRate: bookings.length ? Math.round((delivered.length / bookings.length) * 100) : 0,
        monthlyGrowth: bookings.length ? 12 : 0,
      },
      monthlyRevenue: Object.entries(monthlyMap).map(([label, value]) => ({ label, value })),
      courierPerformance: couriers,
      topCities: rank(cityMap).slice(0, 5),
      risk: { score: riskScore, level: riskScore >= 60 ? "High" : riskScore >= 30 ? "Medium" : "Low", mismatches, failed, returned },
      insights: [
        `${delivered.length} shipments completed successfully`,
        `${mismatches} parcels need weight review`,
        couriers[0] ? `${couriers[0].name} is your top performing courier` : "Book shipments to generate courier insights",
      ],
    });
  } catch (err) {
    res.status(500).json({ msg: "Unable to generate analytics", error: err.message });
  }
};
