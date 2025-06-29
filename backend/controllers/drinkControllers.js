const Drink = require("../models/drinkModels");
const Ingredient = require("../models/ingredientModels");
const Fridge = require("../models/Fridge");

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

exports.getAvailableDrinks = async (req, res) => {
    const userId = req.user.id; // Make sure your JWT middleware sets this

    try {
        const fridge = await Fridge.findOne({ user: userId });
        const userIngredients = fridge?.items?.map(item => item.name.toLowerCase()) || [];

        if (userIngredients.length === 0) {
            return res.status(200).json({ drinks: [] });
        }

        const session = driver.session();

        const result = await session.readTransaction(tx =>
            tx.run(
                `
                MATCH (d:Drink)-[:HAS]->(i:Ingredient)
                WHERE toLower(i.name) IN $userIngredients
                WITH d, collect(i.name) AS matched, size((d)-[:HAS]->()) AS total
                WHERE size(matched) = total
                RETURN d.id AS id, d.name AS name
                `,
                { userIngredients }
            )
        );

        const drinks = result.records.map(r => ({
            id: r.get("id"),
            name: r.get("name")
        }));

        await session.close();
        return res.status(200).json({ drinks });

    } catch (err) {
        console.error("❌ Error in getAvailableDrinks:", err);
        return res.status(500).json({ message: "Server error while fetching available drinks." });
    }
};

