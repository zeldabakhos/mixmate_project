const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/auth");
const { createDrink, getDrinks } = require("../controllers/drinkControllers");
const verifyToken = require("../middleware/verifyToken");


router.post("/create", verifyUser, createDrink);
router.get("/", getDrinks);
router.get("/available", verifyToken, drinkController.getAvailableDrinks);

module.exports = router;
