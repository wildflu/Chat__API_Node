const { MongoClient } = require ('mongodb')
let dbConnection
module.exports = {
    connectoDb: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/trush')
            .then((client) => {
                dbConnection = client.db()
                return cb()
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection 
}



