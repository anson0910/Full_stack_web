// Interact with the MongoDB server using created module operations.js
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var dbOper = require('./operations');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';

var coll = "dishes";
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db)  {
  assert.equal(err, null);
  console.log("Connected correctly to the server");

  dbOper.insertDocument(db, {name: "Vadonut", description: "Test"},
  coll, function(result)  {
    console.log("After insert:");
    console.log(result.ops);

    dbOper.findDocuments(db, coll, function(docs) {
      console.log("Find results:");
      console.log(docs);

      dbOper.updateDocument(db, {name: "Vadonut"}, {description: "Updated test"},
      coll, function(result)  {
        console.log("After update:");
        console.log(result.result);

        dbOper.findDocuments(db, coll, function(docs) {
          console.log(docs);
          db.dropCollection(coll, function(err, result)  {
            assert.equal(err, null);
            assert.equal(result, true);
            console.log("Dropped collection: " + coll);
            db.close();
          });
        });
      });
    });
  });
});
