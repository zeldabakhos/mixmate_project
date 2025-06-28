const Drink = require("../models/drinkModels");
const Ingredient = require("../models/ingredientModels");

exports.createDrink = async (req, res) => {
    try {
        const { name, description, ingredients } = req.body;

        if (!ingredients || ingredients.length === 0) {
            return res.status(400).json({ message: "A drink must contain at least one ingredient." });
        }

        const resolvedIngredients = [];

        for (const item of ingredients) {
            const ingredient = await Ingredient.findById(item.ingredientId);
            if (!ingredient) {
                return res.status(400).json({ message: `Ingredient not found: ${item.ingredientId}` });
            }

            resolvedIngredients.push({
                ingredient: ingredient._id,
                quantity: item.quantity
            });
        }

        const newDrink = new Drink({
            name,
            description,
            ingredients: resolvedIngredients,
            createdBy: req.userId
        });

        const saved = await newDrink.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDrinks = async (req, res) => {
    try {
        const drinks = await Drink.find().populate("ingredients.ingredient");
        res.status(200).json(drinks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
