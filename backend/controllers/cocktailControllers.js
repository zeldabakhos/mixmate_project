const neo4j = require("../utils/neo4j");
const Fridge = require("../models/fridgeModels");

exports.getMakeableDrinks = async (req, res) => {
  try {
    // Step 1: Get user's fridge ingredients
    const fridge = await Fridge.findOne({ user: req.userId }).populate("items.ingredientId");
    if (!fridge || fridge.items.length === 0) {
      return res.json({ drinks: [] });
    }

    const fridgeIngredientNames = fridge.items.map(item =>
      item.ingredientId.name.toLowerCase()
    );

    const session = neo4j.session();

    // Step 2: Query drinks where ALL required ingredients are in user's fridge
    const query = `
      MATCH (d:Drink)-[:REQUIRES]->(i:Ingredient)
      WITH d, collect(toLower(i.name)) AS requiredIngredients
      WHERE all(ingredient IN requiredIngredients WHERE ingredient IN $fridge)
      RETURN d
    `;

    const result = await session.run(query, {
      fridge: fridgeIngredientNames
    });

    const drinks = result.records.map(record => {
      const d = record.get("d").properties;
      return {
        id: d.id,
        name: d.name,
        category: d.category || null,
        thumbnail: d.thumbnail || null
      };
    });

    await session.close();
    res.json({ drinks });

  } catch (err) {
    console.error("❌ Error in getMakeableDrinks:", err);
    res.status(500).json({ message: "Server error" });
  }
};
