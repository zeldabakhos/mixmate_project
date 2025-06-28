const Fridge = require("../models/fridgeModels");
const Ingredient = require("../models/ingredientModels");

exports.getFridge = async (req, res) => {
    try {
        const fridge = await Fridge.findOne({ user: req.userId }).populate("items.ingredientId");
        if (!fridge) return res.json({ items: [] });

        const items = fridge.items.map(item => ({
            ...item.ingredientId._doc,
            quantity: item.quantity,
            ingredientId: item.ingredientId._id
        }));
        res.json({ items });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateFridgeItem = async (req, res) => {
    const { ingredientId, quantity } = req.body;
    try {
        const fridge = await Fridge.findOne({ user: req.userId });
        if (!fridge) return res.status(404).json({ message: "Fridge not found" });

        const item = fridge.items.find(item => item.ingredientId.equals(ingredientId));
        if (!item) return res.status(404).json({ message: "Ingredient not in fridge" });

        item.quantity = quantity;
        await fridge.save();

        await fridge.populate("items.ingredientId");
        const items = fridge.items.map(item => ({
            ...item.ingredientId._doc,
            quantity: item.quantity,
            ingredientId: item.ingredientId._id,
        }));

        res.json({ items });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addToFridge = async (req, res) => {
    const { name, imageUrl, quantity } = req.body;
  
    if (!name) return res.status(400).json({ message: "Ingredient name is required" });
  
    try {
      // 1. Ensure the ingredient exists in MongoDB
      let ingredient = await Ingredient.findOne({ name });
  
      if (!ingredient) {
        ingredient = await Ingredient.create({
          name,
          imageUrl,
          description: "",
          unit: "unit",
          quantity: 0,
          price: 0
        });
      }
  
      // 2. Find or create the fridge
      let fridge = await Fridge.findOne({ user: req.userId });
      if (!fridge) {
        fridge = new Fridge({ user: req.userId, items: [] });
      }
  
      // 3. Add or update item in fridge
      const existing = fridge.items.find(item => item.ingredientId.equals(ingredient._id));
      if (existing) {
        existing.quantity += quantity || 1;
      } else {
        fridge.items.push({ ingredientId: ingredient._id, quantity: quantity || 1 });
      }
  
      await fridge.save();
      await fridge.populate("items.ingredientId");
  
      const items = fridge.items.map(item => ({
        ...item.ingredientId._doc,
        quantity: item.quantity,
        ingredientId: item.ingredientId._id
      }));
  
      res.status(200).json({ items });
  
    } catch (err) {
      console.error("❌ Error adding to fridge:", err);
      res.status(500).json({ message: "Server error" });
    }
  };  

exports.removeFromFridge = async (req, res) => {
    const { ingredientId } = req.body;
    try {
        let fridge = await Fridge.findOne({ user: req.userId });
        if (fridge) {
            fridge.items = fridge.items.filter(item => !item.ingredientId.equals(ingredientId));
            await fridge.save();
            await fridge.populate("items.ingredientId");
            const items = fridge.items.map(item => ({
                ...item.ingredientId._doc,
                quantity: item.quantity,
                ingredientId: item.ingredientId._id,
            }));
            res.status(200).json({ items });
        } else {
            res.status(200).json({ items: [] });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.clearFridge = async (req, res) => {
    try {
        await Fridge.findOneAndDelete({ user: req.userId });
        res.status(200).json({ message: "Fridge cleared" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};