// Create complete promotions model
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// Create a Schema that has subdocuments
var promotionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: "",
  },
  price: {
    type: Currency,
    required: true
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
var Promotions = mongoose.model('Promotion', promotionSchema);

// Make available to node application
module.exports = Promotions;
