const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/auth");
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItem
} = require("../controllers/cartControllers");

router.get("/", verifyUser, getCart);
router.post("/add", verifyUser, addToCart);
router.put("/update", verifyUser, updateCartItem);
router.post("/remove", verifyUser, removeFromCart);
router.post("/clear", verifyUser, clearCart);


module.exports = router;
