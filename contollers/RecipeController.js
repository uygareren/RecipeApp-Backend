const Recipe = require("../modal/Recipe");
const User = require("../modal/User");
const Category = require("../modal/Category");
const Like = require("../modal/Like");
const Comment = require("../modal/Comment");
const Follow = require("../modal/Follow");
const MadeMealsByRecipe = require("../modal/MadeMealsRecipe");
const multer = require('multer');



exports.postRecipe = async (req, res, next) => {
    const { recipeName, image, ingredients, ingredients_with_measurements, worldCuisinesTagId, 
            recipeDescription, categoryId, userId, calory, level, cooking_time } = req.body;

    // Multer tarafından yüklenen dosyanın bilgisini alın


    if (recipeName == "" || recipeDescription == "" || categoryId == "") {
        return res.status(400).json({ status: 400, success: false, message: "Error" });
    }

    try {

        // Fetch user from the database based on userId
        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(404).json({ status: 404, success: false, message: "User not found" });
        }


        // Yeni bir yemek nesnesi oluşturun
        const newRecipe = await new Recipe({
            recipeName, image, ingredients, ingredients_with_measurements,
            worldCuisinesTagId, recipeDescription, categoryId, userId, calory, level, cooking_time
        });

        newRecipe.user = {
            userId: userId,
            name: user.name,
            surname: user.surname,
            image: user.image
        };


        const savedRecipe = await newRecipe.save(); // Kaydedilen yemek tarifini değişkene atayın

        return res.status(200).json({ status: 200, success: true, message: "Recipe was saved successfully!", _id: savedRecipe._id });

    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}; 

exports.postRecipeImage = async (req,res,next) => {
    const { recipe_id } = req.params;
    const image = req.file.filename;


    try {
        // Find the user by user_id
        const recipe = await Recipe.findById(recipe_id);


        if (!recipe) {
            return res.status(404).json({ message: "User not found" });
        }

        recipe.image = image;
        await recipe.save();

        return res.status(200).json({ message: "Profile image successfully updated.", data:image, success:true });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred, profile image could not be updated." });
    }
}


exports.deleteRecipe = async (req, res, next) => {
    try {   
        const { recipe_id } = req.params;

        // Check if the recipe with the provided ID exists
        const recipe = await Recipe.findById(recipe_id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found", success: false });
        }

        // Attempt to delete the recipe
        await Recipe.findByIdAndDelete({_id: recipe_id});

        return res.status(200).json({ message: "Recipe successfully deleted", success: true });
    } catch (error) {
        // If an error occurs, send a response with the error status
        return res.status(500).json({ error: error.message });
    }
};


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

exports.getRecipeByInterest = async (req, res, next) => {
    const {interest_id} = req.body;

    try {

        if(!interest_id){
            return res.status(400).json({ status: 400, success: false, message: "User Interest Id can not be empty" });
        }

        const recipe_data = await Recipe.find({worldCuisinesTagId:interest_id});
        const simplified_data = recipe_data.map(recipe => ({
            _id: recipe._id,
            user: {
                userId: recipe.user.userId,
                name: recipe.user.name,
                surname: recipe.user.surname,
                image: recipe.user.image
            },
            recipeName: recipe.recipeName,
            image: recipe.image
        }));
        return res.status(200).json({ status: 200, success: true, message: "success", data: simplified_data });

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

exports.getRecipesByFollower = async (req, res, next) => {
    const { user_id } = req.body;

    // followed_ids değişkeninden takip edilen kullanıcıların ID'lerini alın

    try {


        if(!user_id){
            return res.status(400).json({ status: 400, success: true, message: "user id is required!"});
        }

        const followed_ids = await Follow.find({userId:user_id});

        const followedIds = followed_ids.map(follow => follow.followed.map(item => item._id)).flat();


        // Takip edilen kullanıcıların tariflerini toplamak için bir dizi asenkron sorgu oluşturun
        const recipePromises = followedIds.map(async (followedId) => {
            const recipes = await Recipe.find({ userId: followedId });
            return recipes;
        });

        const recipeResults = await Promise.all(recipePromises);

        const allRecipes = recipeResults.flat();

        return res.status(200).json({ status: 200, success: true, message: "success", data: allRecipes });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}

exports.getMadeMealsByRecipe = async(req, res, next) => {
    const { recipe_id } = req.params;

    try {
        if(!recipe_id){
            return res.status(400).json({ status: 400, success: true, message: "Recipe id is required!"});
        }

        const data = await MadeMealsByRecipe.findOne({recipeId:recipe_id});

        return res.status(200).json({ status: 200, success: true, message: "success", data: data });
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}

exports.getDoneLengthMadeMealsByRecipe = async(req, res, next) => {
    const { recipe_id } = req.params;

    try {
        if(!recipe_id){
            return res.status(400).json({ status: 400, success: true, message: "Recipe id is required!"});
        }

        const data = await MadeMealsByRecipe.findOne({recipeId:recipe_id});
        const doneUserData = data.user.filter((user) => user.status == 1);

        return res.status(200).json({ status: 200, success: true, message: "success", data: doneUserData.length });
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}


// exports.getPopularRecipe = (req, res, next) => {
    
// }

