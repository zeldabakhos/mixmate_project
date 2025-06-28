const mongoose = require("mongoose");

const drinkSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    ingredients: [
        {
            ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
            quantity: Number
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Drink", drinkSchema);
