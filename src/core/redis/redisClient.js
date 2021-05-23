const { promisify } = require("util");
const redis = require("redis");
const client = redis.createClient({
    port: 6379,
    host: "redis"
});
const getAsync = promisify(client.get).bind(client);

const redisClient = {};

redisClient.get = promisify(client.get).bind(client);

redisClient.set = promisify(client.set).bind(client);

redisClient.hset = promisify(client.hset).bind(client);

module.exports = redisClient;


