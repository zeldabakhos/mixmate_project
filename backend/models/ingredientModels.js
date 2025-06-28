const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: String,
    description: String,
    quantity: Number,         
    unit: String,             
    imageUrl: String
}, { collection: 'ingredients' });

module.exports = mongoose.model("Ingredient", ingredientSchema, "ingredients");
