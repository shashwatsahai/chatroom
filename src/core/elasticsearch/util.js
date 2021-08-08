const ESClient = require("./client");

const setting = {
    "index.translog.durability": "async",
    "index.translog.sync_interval": "1m",
    "index": {
        "max_ngram_diff": 20
    },
    "analysis": {
        "analyzer": {
            "my_lowercase": {
                "type": "custom",
                "tokenizer": "standard",
                "filter": ["lowercase", "prefixes"]
            }
        },
        "filter": {
            "prefixes": {
                "type": "ngram",
                "min_gram": 1,
                "max_gram": 15
            }
        }
    }
};

const ESUtil = {}
ESUtil.createIndex = (indexname, mappings, cb) => {
    let create = {
        body: {
            // TODO We have to revisit this for scalability
            "settings": setting,
            "mappings": mappings
        },
        index: indexname
    };

    ESClient.indices.create(create, (err, resp, status) => {
        cb(err, resp, status);
    });
}


ESUtil.deleteIndex = (config, cb) => {
    ESClient.indices.delete({
        index: config.index
    }, (err, resp, status) => {
        if (!err) {
            console.info(`Index : ${config.index} deleted!!`);
        } else {
            console.info(`Index : ${config.index} could not be deleted!! ${err}`);

        }
        cb(err, resp, status);
    });
}

ESUtil.addDocument = (config, cb) => {
    const doc = config.doc;
    ESClient.index({
        index: config.index,
        type: config.type,
        id: doc.id,
        body: doc.body,
        refresh: config.refresh
    }, cb);
}

module.exports = ESUtil