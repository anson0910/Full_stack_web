// Create complete dishes model
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a Schema that has subdocuments
var favoriteSchema = new Schema({
  postedBy: {   // reference to User model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  }]
}, {
  timestamps: true
});

/* Create a model using Schema, mongoose will make collection in plural form.
  Ex. Dish --> collection named dishes
*/
var Favorites = mongoose.model('Favorite', favoriteSchema);

// Make available to node application
module.exports = Favorites;
