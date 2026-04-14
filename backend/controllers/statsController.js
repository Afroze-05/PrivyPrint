const User = require("../models/User");
const Log = require("../models/Log");
const Alert = require("../models/Alert");

async function getStats(req, res) {
  try {
    const adminTrustScorePromise = req.user?.id
      ? User.findById(req.user.id).select("trustScore").lean()
      : Promise.resolve(null);

    const [totalUsers, totalPrints, totalAlerts, printsByTypeAgg, admin] =
      await Promise.all([
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
    return res
      .status(500)
      .json({ message: "Failed to fetch stats.", error: err.message });
  }
}

async function getPrintStats(req, res) {
  try {
    const [total, printsByTypeAgg] = await Promise.all([
      Log.countDocuments(),
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
    ]);

    const stats = { Color: 0, "B/W": 0 };
    for (const row of printsByTypeAgg) {
      if (row._id === "Color") stats.Color = row.count;
      if (row._id === "B/W") stats["B/W"] = row.count;
    }

    return res.status(200).json({
      bw: stats["B/W"],
      color: stats.Color,
      total,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch print stats.", error: err.message });
  }
}

async function getCharts(req, res) {
  try {
    const { filter = "7days" } = req.query;
    console.log("Charts request with filter:", filter);

    const now = new Date();
    let startDate;

    switch (filter) {
      case "today":
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "7days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "30days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
    }

    // Get user registration data over time
    const usersByDay = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get print activity over time
    const printsByDay = await Log.aggregate([
      {
        $match: {
          time: { $gte: startDate },
          "doc.status": "completed",
        },
      },
      {
        $lookup: {
          from: "documents",
          localField: "token",
          foreignField: "token",
          as: "doc",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$time",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get upload activity over time
    const uploadsByDay = await Log.aggregate([
      {
        $match: {
          time: { $gte: startDate },
          "doc.action": "upload",
        },
      },
      {
        $lookup: {
          from: "documents",
          localField: "token",
          foreignField: "token",
          as: "doc",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$time",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Combine data for chart
    const combinedData = [];
    const dayCount = filter === "today" ? 1 : filter === "7days" ? 7 : 30;
    console.log(`Generating ${dayCount} days of data from:`, startDate);

    for (let i = 0; i < dayCount; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().slice(0, 10);

      const userDayData = usersByDay.find((u) => u._id === dateStr);
      const printDayData = printsByDay.find((p) => p._id === dateStr);
      const uploadDayData = uploadsByDay.find((u) => u._id === dateStr);

      combinedData.push({
        date: currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        prints: printDayData?.count || 0,
        users: userDayData?.count || 0,
        uploads: uploadDayData?.count || 0,
      });
    }

    console.log("Chart data generated:", combinedData.length, "points");
    return res.status(200).json(combinedData);
  } catch (err) {
    console.error("Failed to fetch chart data:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch chart data", error: err.message });
  }
}

module.exports = { getStats, getPrintStats, getCharts };
