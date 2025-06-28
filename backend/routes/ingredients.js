const express = require("express");
const router = express.Router();
const {
  getIngredients,
  addIngredient,
  updateIngredient,
  getSingleIngredient
} = require("../controllers/ingredientControllers");

const { verifyAdmin, verifyToken } = require("../middleware/auth");
const upload = require("../middleware/multerConfig");
const Ingredient = require("../models/ingredientModels");

// Get all ingredients
router.get("/", getIngredients);

// Get a single ingredient
router.get("/:id", getSingleIngredient);

// Add an ingredient (admin only)
router.post(
  "/",
  verifyAdmin,
  upload.single("image"),
  addIngredient
);

// Update an ingredient (admin only)
router.put(
  "/:id",
  verifyAdmin,
  upload.single("image"),
  updateIngredient
);

// Delete an ingredient (admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedIngredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!deletedIngredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    res.json({ message: "Ingredient deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
