// backend/routes/cocktail.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const { getMakeableDrinks } = require("../controllers/cocktailControllers");
const { verifyUser } = require("../middleware/auth");

router.get("/makeable", verifyUser, getMakeableDrinks);
router.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const drink = response.data.drinks?.[0];

    if (!drink) {
      return res.status(404).json({ message: "Drink not found in external API" });
    }

    res.json(drink);
  } catch (err) {
    console.error("❌ Error in /details/:id:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
