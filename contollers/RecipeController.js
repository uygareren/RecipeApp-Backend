const Recipe = require("../modal/Recipe");
const Category = require("../modal/Category");
const Like = require("../modal/Like");


exports.postRecipe = async (req, res, next) => {

    const {recipeName, image, ingredients, ingredients_with_measurements,worldCuisinesTagId, 
    recipeDescription,categoryId,calory,level,cooking_time } = req.body;

    if(recipeName == "" || recipeDescription == "" || categoryId == ""){
        return res.status(400).json({ status: 400, success: false, message: "Error" });
        
    }

    try {
        const newRecipe = new Recipe({recipeName, image, ingredients, ingredients_with_measurements,
        worldCuisinesTagId,recipeDescription, categoryId,calory, level,cooking_time});
        const result = await newRecipe.save();

        return res.status(200).json({ status: 200, success: true, message: "Recipe was saved succesfully!" });
        

    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
        
    }



}
exports.getRecipeById = async (req, res, next) => {
    const recipe_id = req.params.recipe_id;

    if (!recipe_id) {
        return res.status(400).json({ status: 400, success: false, message: "Id cannot be empty!" });
    }

    try {
        const recipe = await Recipe.findById(recipe_id);
        
        if (!recipe) {
            return res.status(404).json({ status: 404, success: false, message: "Recipe not found" });
        }

        const likeData = await Like.find({ recipeId: recipe_id, isLike: true });

        const data = { recipe, likeData: likeData ? likeData : null };

        return res.status(200).json({ status: 200, success: true, message: "Successful", data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


exports.getRecipesByCategoryId = async (req, res, next) => {

    const category_id = req.params.category_id;

    if(!category_id){
        return res.status(400).json({ status: 400, success: false, message: "Category Id can not be empty!" });
    }

    try {
        const data = await Recipe.find({ categoryId: category_id });
       return res.status(200).json({ status: 200, success: true, message: "Succesfull", data:{data} });

        
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
        
    }

}

exports.getRecipeByIngredients = async (req, res, next) => {
    const ingredients_by_user = req.body.ingredients;

    console.log("ingredients", ingredients_by_user);

    if (ingredients_by_user.length === 0) {
        return res.status(400).json({ status: 400, success: false, message: "Ingredients can not be empty" });
    }

    try {
        const data = await Recipe.find({ ingredients: { $all: ingredients_by_user } });
        if(data.length == 0){
        return res.status(400).json({ status: 400, success: false, message: "There is no any recipe!",});

        }
        return res.status(200).json({ status: 200, success: true, message: "Successful", data: { data } });
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


// exports.getPopularRecipe = (req, res, next) => {
    
// }

