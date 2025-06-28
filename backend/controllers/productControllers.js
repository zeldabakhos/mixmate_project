const Product = require("../models/productModels")

exports.getProduct = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (req.file) {
      updateData.imageUrl = req.file.path.replace(/\\/g, "/");
    }
    try {
      const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ message: "Product not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  
exports.addProduct = async (req, res) => {
    const { productName, productDescription, brand, model, stock, price } = req.body;
    // Build full URL if file exists:
    const imageUrl = req.file
      ? req.protocol + "://" + req.get("host") + "/" + req.file.path.replace(/\\/g, "/")
      : null;
    try {
        const newProduct = new Product({
            productName,
            productDescription,
            brand,
            model,
            stock,
            price,
            imageUrl, // now a full URL!
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Not found" });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  