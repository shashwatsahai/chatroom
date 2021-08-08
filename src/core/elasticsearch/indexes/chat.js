const ESClient = require("../client");
const ESUtil = require("../util");
const INDEX_NAME = 'my-chat'

var chatIndex = {}

const mappings = {
    properties: {
        text: {
            type: "text",
            analyzer: "my_lowercase",
            "search_analyzer": "standard"
        },
        actionBy: {
            type: "text",
            analyzer: "my_lowercase",
            "search_analyzer": "standard"
        },
        room: {
            type: "keyword"
        }
    }
};


chatIndex.createIndex = () => {
    ESUtil.deleteIndex({ index: INDEX_NAME }, () => {
        ESUtil.createIndex(INDEX_NAME, mappings, (err, resp, status) => {
            console.log("err", err, "resp", resp, "status", status);
        })
    })
}

chatIndex.search = (data, callback) => {
    const body = {
        "query": {
            "bool": {
                "must": [
                    {
                        "match": {
                            "text": data.text
                        }
                    },
                    {
                        "term": {
                            "room": data.room
                        }
                    }
                ]
            }
        }
    }

    ESClient.search({
        body: body,
        index: INDEX_NAME,
        size: 200
    }, (error, result) => {
        if (error) {
            callback(error, null);
        } else {
            let messages = [];
            if (result && result.hits && result.hits.hits) {
                messages = result.hits.hits.map(art => {
                    return art._source;
                });
            }
            return callback(error, { messages });
        }
    });
}


chatIndex.indexDoc = (data, cb) => {
    console.log(data)
    let bodyObj = {}
    bodyObj.actionBy = data.username;
    bodyObj.text = data.msg;
    bodyObj.room = data.room;
    ESClient.index({
        index: INDEX_NAME,
        body: bodyObj
    }, (err, response, status) => {
        if (err) {
            //logger.error({err}, `[Elasticsearch] [${this.indexName}] Failed to index doc id=${id}:`, body);
            console.error({ err }, `[Elasticsearch] [${this.indexName}] Failed to index doc`, bodyObj);
        }
        return cb(err, response);
    })
}


module.exports = chatIndex;