const jwt = require("jsonwebtoken");

const JWT_SECRET = "yagami23";

const USERS = {
  lylia: "users",
  silence: "free125"
};

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password } = req.body || {};

  if (USERS[username] && USERS[username] === password) {
    const token = jwt.sign({ username, limit: 10 }, JWT_SECRET, {
      expiresIn: "1d"
    });
    return res.status(200).json({ success: true, token });
  }

  return res.status(401).json({ success: false });
};
