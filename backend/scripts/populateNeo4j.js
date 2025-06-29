const fetch = require('node-fetch');
const driver = require("../config/neo4j");
require('dotenv').config({ path: '../.env.local' });

const populate = async () => {
  const session = driver.session();

  try {
    // 1. Fetch list of cocktails
    const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail");
    const baseDrinks = await res.json();

    for (const drink of baseDrinks.drinks) {
      try {
        // Throttle to avoid rate-limiting
        await new Promise(resolve => setTimeout(resolve, 300));

        // 2. Fetch full drink info
        const resDetail = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`);
        const rawText = await resDetail.text();

        let detail;
        try {
          detail = JSON.parse(rawText);
        } catch (err) {
          console.error(`❌ Failed to parse JSON for drink ID: ${drink.idDrink}`);
          console.error("Response was:", rawText);
          continue; // Skip this drink
        }

        const d = detail.drinks?.[0];
        if (!d) {
          console.warn(`⚠️ No details found for drink ID: ${drink.idDrink}`);
          continue;
        }

        // 3. Extract ingredients
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
          const ing = d[`strIngredient${i}`];
          if (ing) ingredients.push(ing.trim());
        }

        // 4. Create drink node and relationships
        await session.writeTransaction(tx =>
          tx.run(
            `
            MERGE (d:Drink {id: $id, name: $name})
            WITH d
            UNWIND $ingredients AS ing
              MERGE (i:Ingredient {name: ing})
              MERGE (d)-[:HAS]->(i)
            `,
            {
              id: d.idDrink,
              name: d.strDrink,
              ingredients,
              thumb: d.strDrinkThumb || null,
              category: d.strCategory || null
            }
          )
        );
      } catch (err) {
        console.error(`❌ Error processing drink ID ${drink.idDrink}:`, err.message);
      }
    }

    console.log("✅ Drinks and ingredients imported to Neo4j.");
  } catch (err) {
    console.error("❌ Error populating Neo4j:", err);
  } finally {
    await session.close();
    await driver.close();
  }
};

populate();
