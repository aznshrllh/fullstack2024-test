const redis = require("redis");

// Create Redis client with current version format
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || "localhost"}:${
    process.env.REDIS_PORT || 6379
  }`,
});

// Connect using async function
(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
})();

// Handle errors
client.on("error", (err) => {
  console.log("Redis Client Error", err);
});

// Create Redis helper functions
const getAsync = async (key) => await client.get(key);
const setAsync = async (key, value) => await client.set(key, value);
const delAsync = async (key) => await client.del(key);

module.exports = {
  client,
  getAsync,
  setAsync,
  delAsync,
};
