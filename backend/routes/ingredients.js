const express = require("express");
const router = express.Router();
const { getIngredient, addIngredient, updateIngredient, getSingleIngredient } = require("../controllers/ingredientControllers");
const { verifyAdmin, verifyToken } = require("../middleware/auth");
const upload = require("../middleware/multerConfig");
const Ingredient = require("../models/ingredientModels"); 

// Get ingredients
router.get('/seeIngredient', getIngredient);
router.get('/seeIngredient/:id', getSingleIngredient);

// Add Ingredient (admin only)
router.post(
  '/addIngredient',
  verifyAdmin,
  upload.single("image"),
  addIngredient
);

// Update Ingredient (admin only)
router.put(
  '/updateIngredient/:id',
  verifyAdmin,
  upload.single("image"),
  updateIngredient
);

// Delete Ingredient (admin only)
router.delete(
  '/deleteIngredient/:id',
  verifyAdmin,
  async (req, res) => {
    try {
      const deletedIngredient = await Ingredient.findByIdAndDelete(req.params.id);
      if (!deletedIngredient) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
      res.json({ message: "Ingredient deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
