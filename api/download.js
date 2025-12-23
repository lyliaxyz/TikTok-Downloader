const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "yagami23";
const usage = {};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  let payload;
  try {
    payload = jwt.verify(auth.split(" ")[1], JWT_SECRET);
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }

  const user = payload.username;
  usage[user] ??= 0;

  if (usage[user] >= payload.limit) {
    return res.status(429).json({
      status: false,
      message: "Limit harian habis"
    });
  }

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ message: "URL kosong" });

  try {
    usage[user]++;

    const api = `https://api-lyliasilence.vercel.app/download/tiktok?apikey=xyz2025&url=${encodeURIComponent(url)}`;
    const r = await fetch(api);
    const data = await r.json();

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ status: false });
  }
};
