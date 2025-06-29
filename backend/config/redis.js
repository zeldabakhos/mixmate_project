const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
});

const connectRedis = async () => {
  redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
  await redisClient.connect();
  console.log("✅ Redis connected");
};

module.exports = { connectRedis, redisClient: redisClient };
