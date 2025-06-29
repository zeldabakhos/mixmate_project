const driver = require("../utils/neo4j");
const Fridge = require("../models/fridgeModels");

exports.getMakeableDrinks = async (req, res) => {
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const fridge = await Fridge.findOne({ user: req.userId }).populate("items.ingredientId");
    if (!fridge || fridge.items.length === 0) {
      return res.json({ drinks: [] });
    }

    const fridgeIngredientNames = fridge.items
      .filter(item => item.ingredientId && item.ingredientId.name)
      .map(item => item.ingredientId.name.toLowerCase());

    const query = `
      MATCH (d:Drink)-[:HAS]->(i:Ingredient)
      WITH d, collect(toLower(i.name)) AS requiredIngredients
      WHERE all(ingredient IN requiredIngredients WHERE ingredient IN $fridge)
      RETURN d
    `;

    const result = await session.run(query, { fridge: fridgeIngredientNames });

    const drinks = result.records.map(record => {
      const d = record.get("d").properties;
      return {
        id: d.idDrink, // ✅ Fix here
        name: d.name,
        category: d.category || null,
        thumb: d.thumb || null,
      };
    });
    console.log("✅ Matching drinks:", drinks);
    res.json({ drinks });
  } catch (err) {
    console.error("❌ Error in getMakeableDrinks:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    await session.close();
  }
};
