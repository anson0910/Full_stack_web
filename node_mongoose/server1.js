// Perform some insert and find operations on database using mongoose
var mongoose = require('mongoose');
var assert = require('assert');

var Dishes = require('./models/dishes1.js');

// Conection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function()  {
  // Connection successful
  console.log("Connected successfully to server!");

  // Create a new dish
  var newDish = Dishes({
    name: 'Uthapizza',
    description: 'Test'
  });

  // Save dish
  newDish.save(function(err)  {
    if (err)  throw err;
    console.log("Dish created!");

    // Get all dishes
    Dishes.find({}, function(err, dishes) {
      if (err)  throw err;
      console.log(dishes);
      db.collection('dishes').drop(function() {
        db.close();
      });
    });
  });
});
