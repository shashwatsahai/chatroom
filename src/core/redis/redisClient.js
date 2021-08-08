const { promisify } = require("util");
const redis = require("redis");
const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
});
const getAsync = promisify(client.get).bind(client);

const redisClient = {};

redisClient.get = promisify(client.get).bind(client);

redisClient.set = promisify(client.set).bind(client);

redisClient.hset = promisify(client.hset).bind(client);

module.exports = redisClient;


