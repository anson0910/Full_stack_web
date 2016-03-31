// Perform operations on complete promotions model
var mongoose = require('mongoose');
var assert = require('assert');

var Promotions = require('./models/promotions.js');

// Conection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function()  {
  // Connection successful
  console.log("Connected successfully to server!");

  // Create a new promotion
  Promotions.create({
    name: "Weekend Grand Buffet",
    image: "images/buffet.png",
    label: "New",
    price: "19.99",
    description: "Featuring ..."
  }, function(err, promotion)  {
    if (err)  throw err;
    console.log("Promotion created!");
    console.log(promotion);
    console.log("Price presented to user: " + ((promotion.price) / 100).toFixed(2));

    var id = promotion._id;

    // Update promotion
    setTimeout(function() {
      Promotions.findByIdAndUpdate(id, {
        $set: {
          description: 'Updated test'
        }
      }, {
        new: true
      })
      .exec(function(err, promotion) {
        if (err) throw err;
        console.log("Updated promotion!");
        console.log(promotion);

        promotion.save(function(err, promotion) {
          db.collection('promotions').drop(function() {
            db.close();
          })
        });
      });
    }, 3000);
  });
});
