const mongoose = require("mongoose");

const fridgeItemSchema = new mongoose.Schema({
  ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient", required: true },
  quantity: { type: Number, required: true },
});

const fridgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [fridgeItemSchema],
});

module.exports = mongoose.model("Fridge", fridgeSchema);
