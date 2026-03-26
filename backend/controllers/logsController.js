const Log = require("../models/Log");
const Document = require("../models/Document");

async function getPrintLogs(_req, res) {
  try {
    const logs = await Log.find({}).sort({ time: -1 }).lean();
    const tokens = logs.map((l) => l.token);
    if (tokens.length === 0) {
      return res.status(200).json({ logs: [] });
    }

    const docs = await Document.find({ token: { $in: tokens } })
      .select("token type copies status")
      .lean();

    const docByToken = new Map(docs.map((d) => [d.token, d]));

    const merged = logs.map((l) => {
      const doc = docByToken.get(l.token);
      return {
        token: l.token,
        copies: doc?.copies ?? null,
        type: doc?.type ?? null,
        time: l.time,
        status: doc?.status ?? "completed",
      };
    });

    return res.status(200).json({ logs: merged });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch print logs.", error: err.message });
  }
}

module.exports = { getPrintLogs };

