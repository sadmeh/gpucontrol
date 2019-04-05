var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/gpucontrol";
const lodash = require("lodash");

var db = {
    createDb(){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            console.log("Database created!");
            var dbo = db.db("gpucontrol");
            dbo.createCollection("status", function(err, res) {
                if (err) throw err;
                console.log("Status collection created!");
                db.close();
            });
        });
    },
    insertStatus(status){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("gpucontrol");
            dbo.collection("status").insertOne(status, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });

    },
    async fetchLastStatus(graphicIndex, count, callback){
        let command;

       MongoClient.connect(url, async function(err, db) {
            if (err) throw err;
            var dbo = db.db("gpucontrol");
            command = dbo.collection('status').find({}).sort({timestamp:-1}).limit(count);
            command.toArray(function (err, data) {
               callback( lodash.map(data, `gpu[${graphicIndex}]`));
            });
        });

    }
};
module.exports = db;
