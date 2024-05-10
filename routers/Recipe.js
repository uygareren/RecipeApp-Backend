const express = require("express");
const router = express.Router();
const multer = require('multer');


const RecipeController = require("../contollers/RecipeController");
const deleteRecipesWithBase64Image = require("../middleware/deleteRecipeMiddleware");
const {deleteCommentByUser, deleteCommentByRecipe} = require("../middleware/commentMiddleware");
const {deleteLikeByUser, deleteLikesByRecipe} = require("../middleware/likeMiddleware");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/recipes');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

router.post("/delete-recipe/:recipe_id",  RecipeController.deleteRecipe);
router.post("/post-recipe",  RecipeController.postRecipe);
router.post("/post-recipe-image/:recipe_id", upload.single("recipe"), RecipeController.postRecipeImage);
router.get("/recipe-detail/:recipe_id", deleteCommentByUser, deleteCommentByRecipe, deleteLikeByUser, deleteLikesByRecipe, RecipeController.getRecipeById);
router.get("/recipe-by-category/:category_id", deleteRecipesWithBase64Image, RecipeController.getRecipesByCategoryId);
router.post("/recipe-by-ingredients",deleteRecipesWithBase64Image, RecipeController.getRecipeByIngredients);
router.post("/recipe-by-interests", deleteRecipesWithBase64Image, RecipeController.getRecipesByInterests);
router.get("/recipe-search", RecipeController.searchRecipes);
router.post("/recipe-by-follower", RecipeController.getRecipesByFollower);
router.post("/recipe-by-interest", RecipeController.getRecipeByInterest);


module.exports = router;