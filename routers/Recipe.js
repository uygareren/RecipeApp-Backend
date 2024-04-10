const express = require("express");
const router = express.Router();

const RecipeController = require("../contollers/RecipeController");

router.post("/post-recipe", RecipeController.postRecipe);
router.get("/recipe-detail/:recipe_id", RecipeController.getRecipeById);
router.get("/recipe-by-category/:category_id", RecipeController.getRecipesByCategoryId);
router.post("/recipe-by-ingredients", RecipeController.getRecipeByIngredients);
router.get("/recipe-by-interests", RecipeController.getRecipesByInterests);
router.get("/recipe-search", RecipeController.searchRecipes);


module.exports = router;