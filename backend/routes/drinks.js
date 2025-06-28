const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/auth");
const { createDrink, getDrinks } = require("../controllers/drinkControllers");

router.post("/create", verifyUser, createDrink);
router.get("/", getDrinks);

module.exports = router;
