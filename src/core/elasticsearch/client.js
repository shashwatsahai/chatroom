const ElasticSearch = require("elasticsearch")

if (!process.env.ES_HOST) {
    console.log("Missing ES_CONFIG in settings! quitting.");
    process.exit(1);
}
module.exports = ElasticSearch.Client({
    hosts: process.env.ES_HOST
});
