const express = require("express");
const router = express.Router();

const IngredientsController = require("../contollers/IngredientsController");

router.post("/save_ingredients", IngredientsController.saveIngredients);
router.get("/get_all_ingredients", IngredientsController.getAllIngredients);


module.exports = router;