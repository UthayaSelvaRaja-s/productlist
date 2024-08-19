//  Mongoose Schema
const mongoose = require('mongoose');

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
    // Define the 'name , category' field of the schema
  // type: String indicates that this field should store a string value
    name: { type: String, required: true },
  category: { type: String, required: true },// required: true means that this field is mandatory

  // Define the 'price' field of the schema
  // type: Number indicates that this field should store a number value
  price: { type: Number, required: true }
});
// Export the Product model based on the defined schema
module.exports = mongoose.model('Product', productSchema);

  