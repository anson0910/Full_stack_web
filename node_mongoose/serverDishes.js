// Perform operations on complete dishes model
var mongoose = require('mongoose');
var assert = require('assert');

var Dishes = require('./models/dishes.js');

// Conection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function()  {
  // Connection successful
  console.log("Connected successfully to server!");

  // Create a new dish
  Dishes.create({
    name: 'Uthapizza',
    image: "images/uthapizza.png",
    category: "mains",
    label: "Hot",
    price: "4.99",
    description: "A unique ...",
    comments: [
      {
        "rating": 5,
        "comment": "Imagine all the eatables, living in conFusion!",
        "author": "John Lemon"
      },
      {
        "rating": 4,
        "comment": "Sends anyone to heaven, I wish I could get my mother-in-law to eat it!",
        "author": "Paul McVites"
      }
    ]
  }, function(err, dish)  {
    if (err)  throw err;
    console.log("Dish created!");
    console.log(dish);
    console.log("Price presented to user: " + ((dish.price) / 100).toFixed(2));

    var id = dish._id;

    // Update dish
    setTimeout(function() {
      Dishes.findByIdAndUpdate(id, {
        $set: {
          description: 'Updated test'
        }
      }, {
        new: true
      })
      .exec(function(err, dish) {
        if (err) throw err;
        console.log("Updated dish!");
        console.log(dish);

        dish.comments.push({
          rating: 5,
          comment: 'I\'m getting a sinking feeling!',
          author: 'Leonardo di Carpaccio'
        });

        dish.save(function(err, dish) {
          console.log('Updated comments!');
          console.log(dish);

          db.collection('dishes').drop(function() {
            db.close();
          })
        });
      });
    }, 3000);
  });
});
