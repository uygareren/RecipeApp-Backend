const User = require('../modal/User');
const Comment = require('../modal/Comment');
const Recipe = require('../modal/Recipe');

exports.deleteCommentByUser = async (req, res, next) => {

    try {
        // Fetch all users
        const users = await User.find();
        
        // Extract userIds from users
        const userIds = users.map(user => user._id);

        // Find comments whose userId is not in userIds array
        const commentsToDelete = await Comment.find({ userId: { $nin: userIds } });

        // Delete the comments
        await Comment.deleteMany({ _id: { $in: commentsToDelete.map(comment => comment._id) } });
    
        next();

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }


    
}
exports.deleteCommentByRecipe = async (req, res, next) => {

    try {
        // Fetch all users
        const recipes = await Recipe.find();
        
        // Extract userIds from users
        const recipeIds = recipes.map(recipe => recipe._id);

        // Find comments whose userId is not in userIds array
        const commentsToDelete = await Comment.find({ postId: { $nin: recipeIds } });

        // Delete the comments
        await Comment.deleteMany({ _id: { $in: commentsToDelete.map(comment => comment._id) } });

        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }

    
}


