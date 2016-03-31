// Perform operations on complete leadership model
var mongoose = require('mongoose');
var assert = require('assert');

var Leaders = require('./models/leadership.js');

// Conection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function()  {
  // Connection successful
  console.log("Connected successfully to server!");

  // Create a new leader
  Leaders.create({
    name: "Peter Pan",
    image: "images/alberto.png",
    designation: "Chief Epicurious Officer",
    abbr: "CEO",
    description: "Our CEO, Peter, ...",
  }, function(err, leader)  {
    if (err)  throw err;
    console.log("Leader created!");
    console.log(leader);

    var id = leader._id;

    // Update leader
    setTimeout(function() {
      Leaders.findByIdAndUpdate(id, {
        $set: {
          description: 'Updated test'
        }
      }, {
        new: true
      })
      .exec(function(err, leader) {
        if (err) throw err;
        console.log("Updated leader!");
        console.log(leader);

        leader.save(function(err, leader) {
          db.collection('leaders').drop(function() {
            db.close();
          })
        });
      });
    }, 3000);
  });
});
