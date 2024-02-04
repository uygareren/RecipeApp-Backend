const express = require("express");
const router = express.Router();

const RecipeController = require("../contollers/RecipeController");

router.post("/post-recipe", RecipeController.postRecipe);
router.get("/recipe-detail/:recipe_id", RecipeController.getRecipeById);
router.get("/recipe-by-category/:category_id", RecipeController.getRecipesByCategoryId);
router.get("/recipe-by-ingredients", RecipeController.getRecipeByIngredients);


module.exports = router;