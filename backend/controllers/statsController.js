const User = require("../models/User");
const Log = require("../models/Log");
const Alert = require("../models/Alert");

async function getStats(req, res) {
  try {
    const adminTrustScorePromise = req.user?.id
      ? User.findById(req.user.id).select("trustScore").lean()
      : Promise.resolve(null);

    const [totalUsers, totalPrints, totalAlerts, printsByTypeAgg, admin] = await Promise.all([
      User.countDocuments(),
      Log.countDocuments(),
      Alert.countDocuments(),
      Log.aggregate([
        {
          $lookup: {
            from: "documents",
            localField: "token",
            foreignField: "token",
            as: "doc",
          },
        },
        { $unwind: "$doc" },
        { $match: { "doc.status": "completed" } },
        { $group: { _id: "$doc.type", count: { $sum: 1 } } },
      ]),
      adminTrustScorePromise,
    ]);

    const trustScore = admin?.trustScore ?? 0;

    const printsByType = { Color: 0, "B/W": 0 };
    for (const row of printsByTypeAgg) {
      if (row._id === "Color") printsByType.Color = row.count;
      if (row._id === "B/W") printsByType["B/W"] = row.count;
    }

    // Bar chart data: prints completed in the last 7 days.
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const printsByDayAgg = await Log.aggregate([
      { $match: { time: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const printsByDayMap = new Map(printsByDayAgg.map((r) => [r._id, r.count]));
    const printsByDay = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
      return { date: key, count: printsByDayMap.get(key) || 0 };
    });

    return res.status(200).json({
      totalUsers,
      totalPrints,
      printsByType,
      totalAlerts,
      printsByDay,
      trustScore,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch stats.", error: err.message });
  }
}

module.exports = { getStats };

