const Cart = require("../models/cartModels");
const Product = require("../models/productModels");

exports.getCart = async (req, res) => {
    try {
      // Assuming you have a Cart model per user
      const cart = await Cart.findOne({ user: req.userId }).populate("items.productId");
      if (!cart) return res.json({ items: [] });
  
      // Flatten/populate items for frontend
      const items = cart.items.map(item => ({
        ...item.productId._doc, // all product fields
        quantity: item.quantity,
        productId: item.productId._id // send id separately if needed
      }));
      res.json({ items });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // Update quantity for item in cart
  exports.updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      const cart = await Cart.findOne({ user: req.userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const item = cart.items.find(item => item.productId.equals(productId));
      if (!item) return res.status(404).json({ message: "Product not in cart" });
  
      item.quantity = quantity;
      await cart.save();
  
      // Populate for frontend consistency
      await cart.populate("items.productId");
      const items = cart.items.map(item => ({
        ...item.productId._doc,
        quantity: item.quantity,
        productId: item.productId._id,
      }));
  
      res.json({ items });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
// Add/update item in cart
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      let cart = await Cart.findOne({ user: req.userId });
      if (!cart) {
        cart = new Cart({ user: req.userId, items: [] });
      }
      const existing = cart.items.find(item => item.productId.equals(productId));
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
      await cart.populate("items.productId"); // Populate the product fields
      const items = cart.items.map(item => ({
        ...item.productId._doc,
        quantity: item.quantity,
        productId: item.productId._id,
      }));
      res.status(200).json({ items });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
// Remove item from cart
exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
      let cart = await Cart.findOne({ user: req.userId });
      if (cart) {
        cart.items = cart.items.filter(item => !item.productId.equals(productId));
        await cart.save();
        await cart.populate("items.productId"); // Populate after removing
        const items = cart.items.map(item => ({
          ...item.productId._doc,
          quantity: item.quantity,
          productId: item.productId._id,
        }));
        res.status(200).json({ items });
      } else {
        res.status(200).json({ items: [] });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
