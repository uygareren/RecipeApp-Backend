const User = require('../modal/User');
const Like = require('../modal/Like');
const Recipe = require('../modal/Recipe');

exports.deleteLikeByUser = async (req, res, next) => {

    try {
        // Fetch all users
        const users = await User.find();
        
        // Extract userIds from users
        const userIds = users.map(user => user._id);

        // Find comments whose userId is not in userIds array
        const likesToDelete = await Like.find({ userId: { $nin: userIds } });

        // Delete the comments
        await Like.deleteMany({ _id: { $in: likesToDelete.map(like => like._id) } });
        next();

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }



    
}
exports.deleteLikesByRecipe = async (req, res, next) => {

    try {
        // Fetch all users
        const recipes = await Recipe.find();
        
        // Extract userIds from users
        const recipeIds = recipes.map(recipe => recipe._id);

        // Find comments whose userId is not in userIds array
        const likesToDelete = await Like.find({ recipeId: { $nin: recipeIds } });

        // Delete the comments
        await Like.deleteMany({ _id: { $in: likesToDelete.map(like => like._id) } });
        next();

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }

    
}


