var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/gpucontrol";

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
};
module.exports = db;
