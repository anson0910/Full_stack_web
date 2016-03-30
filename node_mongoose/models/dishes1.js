// Create dishes collection(model) using Schema
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a Schema
var dishSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

/* Create a model using Schema, mongoose will make collection in plural form.
  Ex. Dish --> collection named dishes
*/
var Dishes = mongoose.model('Dish', dishSchema);

// Make available to node application
module.exports = Dishes;
