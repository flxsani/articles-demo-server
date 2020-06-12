/**
 * Connect MongoDB using Mongodb Node Drive 
 * */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
export var DataService = null;

async function MongoConnect() {
    const url = 'mongodb://localhost:27017/hackernews';
    const dbName = 'hackernews';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        // Use connect method to connect to the Server
        await client.connect();

        const db = client.db(dbName);
        return db;
    } catch (err) {
        console.log(err.stack);
    }
    //return db;
}

MongoConnect().then((resp) => {
    DataService = resp;
    console.log("DB connection success");
}).catch((err) => {
    console.log("Error: ", err);
});
