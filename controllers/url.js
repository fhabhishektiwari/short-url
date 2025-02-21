const shortid = require("shortid");
const URL = require("../models/url");
async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "Url is required" });
  const shortID = shortid();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitedHistory: [],
  });

  res.json({
    id: shortID,
  });
}

async function handleGetAnalytics(req, res) {
  console.log("analytics");
  try {
    const shortId = req.params.shortId; // Corrected from req.query.shortId
    console.log("Short ID received:", shortId);

    const entry = await URL.findOne({ shortId });

    if (!entry) {
      return res.status(404).json({ error: "URL not found" });
    }
    console.log("visitHistory", entry.visitHistory.length);

    res.json({
      totalClicks: entry.visitHistory.length, // Fixed field name
      analytics: entry.visitHistory, // Ensure this matches the DB schema
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics };
