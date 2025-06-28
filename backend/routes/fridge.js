const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/auth");
const {
  getFridge,
  addToFridge,
  removeFromFridge,
  clearFridge,
  updateFridgeItem
} = require("../controllers/fridgeControllers");

router.get("/", verifyUser, getFridge);
router.post("/add", verifyUser, addToFridge);
router.put("/update", verifyUser, updateFridgeItem);
router.post("/remove", verifyUser, removeFromFridge);
router.post("/clear", verifyUser, clearFridge);


module.exports = router;
