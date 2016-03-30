// Create dishes collection(model) with subdocuments using Schema
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required = true
  },
  comment: {
    type: String,
    required = true
  },
  author: {
    type: String,
    required = true
  }
}, {
  timestamps: true
});

// Create a Schema that has subdocuments
var dishSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  comments: [commentSchema]
}, {
  timestamps: true
});

/* Create a model using Schema, mongoose will make collection in plural form.
  Ex. Dish --> collection named dishes
*/
var Dishes = mongoose.model('Dish', dishSchema);

// Make available to node application
module.exports = Dishes;
