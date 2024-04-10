const Recipe = require("../modal/Recipe");
const User = require("../modal/User");
const Category = require("../modal/Category");
const Like = require("../modal/Like");
const Comment = require("../modal/Comment");

exports.postRecipe = async (req, res, next) => {

    const { recipeName, image, ingredients, ingredients_with_measurements, worldCuisinesTagId, 
            recipeDescription, categoryId, userId, calory, level, cooking_time } = req.body;

    if (recipeName == "" || recipeDescription == "" || categoryId == "") {
        return res.status(400).json({ status: 400, success: false, message: "Error" });
    }

    try {
        // Fetch user from the database based on userId
        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(404).json({ status: 404, success: false, message: "User not found" });
        }

        // Create a new recipe and populate the user field
        const newRecipe = new Recipe({
            recipeName, image, ingredients, ingredients_with_measurements,
            worldCuisinesTagId, recipeDescription, categoryId, userId, calory, level, cooking_time
        });

        newRecipe.user = {
            userId: userId,
            name: user.name,
            surname: user.surname,
            image: user.image
        };

        // Save the new recipe
        await newRecipe.save();

        return res.status(200).json({ status: 200, success: true, message: "Recipe was saved successfully!" });

    } catch (error) {
        console.error(error);
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
        const commentData = await Comment.find({ postId: recipe_id });

        const comment_data = await Promise.all(commentData.map(async (item) => {
            const user = await User.findById(item?.userId);
            return {
                _id: item._id,
                postId: item.postId,
                comment: item.comment,
                createdAt: item.createdAt,
                userdata: {
                    user_name: user?.name,
                    user_surname: user?.surname,
                    userId: user?._id,
                    user_image: user?.image
                }
            };
        }));

        const data = { recipe, likeData: likeData ? likeData : null, commentData: comment_data ? comment_data : null };

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


    if (!ingredients_by_user || ingredients_by_user.length === 0) {
        return res.status(400).json({ status: 400, success: false, message: "Ingredients can not be empty" });
    }

    try {
        const data = await Recipe.find({ ingredients: { $in: ingredients_by_user } });
        
        if (data.length === 0) {
            return res.status(400).json({ status: 400, success: false, message: "There is no recipe with these ingredients" });
        }

        return res.status(200).json({ status: 200, success: true, message: "Successful", data: { data } });
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


exports.getRecipesByInterests = async (req, res, next) => {
    const {interests_data_by_user} = req.body;
    const {pagination} = req.query

    if(!interests_data_by_user){
        return res.status(400).json({ status: 400, success: false, message: "User Interests Data can not be empty" });
    }

    try {
        const data = await Recipe.find({worldCuisinesTagId : {$in : interests_data_by_user}});
        if(data.length == 0){
            return res.status(400).json({ status: 400, success: false, message: "There is no any recipe!",});
    
            }
            return res.status(200).json({ status: 200, success: true, message: "Successful", data });
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}

exports.searchRecipes = async (req, res, next) => {
    
    const { searchQuery } = req.query;

    const regex = new RegExp(searchQuery, 'i');
    
    // Recipe modelini kullanarak sorgu yapma
    const recipes = await Recipe.find({ recipeName: regex });

    // Sadece recipeName ve image alanlarını içeren yeni bir dizi oluştur
    const simplifiedRecipes = recipes.map(recipe => ({
        id:recipe._id,
        recipeName: recipe.recipeName,
        image: recipe.image
    }));

    // Başarılı yanıtı döndür
    res.status(200).json({ success: true, data: simplifiedRecipes });
    
};


// exports.getPopularRecipe = (req, res, next) => {
    
// }

