const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: String,
    productDescription: String,
    brand: String,
    model: String,
    stock: Number,
    price: Number,
    imageUrl: String
}, { collection: 'products' });

module.exports = mongoose.model("Product", productSchema, "products");
