const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "yagami23";

// LIMIT MEMORY (reset otomatis saat redeploy / 24 jam)
const usage = {};

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).end();

  let payload;
  try {
    payload = jwt.verify(auth.split(" ")[1], JWT_SECRET);
  } catch {
    return res.status(403).end();
  }

  const user = payload.username;
  usage[user] ??= 0;

  if (usage[user] >= payload.limit) {
    return res.status(429).json({
      status: false,
      message: "Limit harian habis, coba lagi besok"
    });
  }

  const { url } = req.body;

  try {
    usage[user]++;

    const api = `https://api-lyliasilence.vercel.app/download/tiktok?apikey=xyz2025&url=${encodeURIComponent(url)}`;
    const r = await fetch(api);
    const data = await r.json();

    res.json(data);
  } catch {
    res.status(500).json({ status: false });
  }
};
