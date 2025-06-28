const Ingredient = require("../models/ingredientModels");

exports.getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.status(200).json(ingredients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSingleIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: "Not found" });
    res.json(ingredient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addIngredient = async (req, res) => {
  const { name, description, quantity, unit } = req.body;
  const imageUrl = req.file
    ? req.protocol + "://" + req.get("host") + "/" + req.file.path.replace(/\\/g, "/")
    : null;

  try {
    const newIngredient = new Ingredient({
      name,
      description,
      quantity,
      unit,
      imageUrl,
    });

    const savedIngredient = await newIngredient.save();
    res.status(201).json(savedIngredient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateIngredient = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (req.file) {
    updateData.imageUrl = req.file.path.replace(/\\/g, "/");
  }

  try {
    const updated = await Ingredient.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Ingredient not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
