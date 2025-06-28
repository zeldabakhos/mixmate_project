const express = require("express");
const router = express.Router();
const { getProduct, addProduct, updateProduct, getSingleProduct } = require("../controllers/productControllers");
const { verifyAdmin, verifyToken } = require("../middleware/auth");
const upload = require("../middleware/multerConfig");
const Product = require("../models/productModels"); 

// Get products
router.get('/seeProduct', getProduct);
router.get('/seeProduct/:id', getSingleProduct);

// Add product (admin only)
router.post(
  '/addProduct',
  verifyAdmin,
  upload.single("image"),
  addProduct
);

// Update product (admin only)
router.put(
  '/updateProduct/:id',
  verifyAdmin,
  upload.single("image"),
  updateProduct
);

// Delete product (admin only)
router.delete(
  '/deleteProduct/:id',
  verifyAdmin,
  async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
