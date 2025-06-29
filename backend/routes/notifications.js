const express = require("express");
const router = express.Router();
const { redisClient } = require("../config/redis");

// Middleware to protect route
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, async (req, res) => {
  const userKey = `user:${req.userId}`;

  try {
    const notifications = await redisClient.lRange(`${userKey}:notifications`, 0, -1);

    // Optionally clear notifications after reading
    await redisClient.del(`${userKey}:notifications`);

    const parsed = notifications.map(n => {
      try {
        return JSON.parse(n);
      } catch {
        return { name: n };
      }
    });

    res.json({ notifications: parsed });
  } catch (err) {
    console.error("❌ Redis fetch error:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

module.exports = router;
