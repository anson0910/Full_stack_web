// Create complete leadership model
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a Schema that has subdocuments
var leaderSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  abbr: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default:false
  }
}, {
  timestamps: true
});

/* Create a model using Schema, mongoose will make collection in plural form.
  Ex. Dish --> collection named dishes
*/
var Leaders = mongoose.model('Leader', leaderSchema);

// Make available to node application
module.exports = Leaders;
