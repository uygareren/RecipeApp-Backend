const User = require("../modal/User");
const Recipe = require("../modal/Recipe");
const Like = require("../modal/Like");
const Comment = require("../modal/Comment");

exports.postLike = async (req, res, next) => {
    const { recipeId, userId, isLike } = req.body;

    try {
        if (isLike) {
            const isLikeExist = await Like.findOne({ userId, recipeId, isLike: true });

            if (isLikeExist) {
                return res.status(409).json({ status: 409, success: false, message: "You already liked this recipe" });
            }

            const newLike = new Like({ userId, recipeId, isLike });
            const result = await newLike.save();

            return res.status(200).json({ status: 200, success: true, message: "Like added successfully" });
        } else {
            // Delete the like from the database
            const deletedLike = await Like.findOneAndDelete({ userId, recipeId, isLike: true });

            if (deletedLike) {
                return res.status(200).json({ status: 200, success: true, message: "Like removed successfully" });
            } else {
                return res.status(404).json({ status: 404, success: false, message: "Like not found" });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};

exports.removeLike = async (req, res, next) => {
    const { recipeId, userId } = req.body;

    try {
        // Delete the like from the database
        const deletedLike = await Like.findOneAndDelete({ userId, recipeId, isLike: true });

        if (deletedLike) {
            return res.status(200).json({ status: 200, success: true, message: "Like removed successfully" });
        } else {
            return res.status(404).json({ status: 404, success: false, message: "Like not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


exports.postComment = async (req, res, next) => {
    const {userId, recipeId, comment} = req.body;

    if(comment.length  < 1){
        return res.status(400).json({status : 400 ,success: false, message: "Comment can not be empty!"});
    }

    try {
        const newComment = new Comment({userId: userId,postId: recipeId, comment: comment});
        const result = await newComment.save();

        return res.status(200).json({status: 200, success: true, message: "Comment was saved succesfully!"});
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
        
    }

}

exports.getComments = async (req, res, next) => {
    const recipe_id = req.params.recipe_id;

    if(!recipe_id){
        return res.status(400).json({status:400, success: false, message: "Recipe Id is required!"})
    }

    try {
        const comments = await Comment.find({ postId: recipe_id }).sort('createdAt');

        const userDataPromises = comments.map(async (e) => {
            const user = await User.findById(e.userId);
            return {comment: e.comment, userId: e.userId, name: user ? user.name : null, surname: user ? user.surname : null }; // Replace 'username' with the actual user property you want
        })

        console.log("userDataPromise", userDataPromises)

        const userData = await Promise.all(userDataPromises);

        console.log("userData", userData);

        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Comments were loaded successfully!',
            data: {
                postId: recipe_id,
                data: userData
            }
        });
        
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
        
    }

}

exports.deleteComment = async (req, res, next) => {
    const {commentId} = req.body;

    if(!commentId){
        return res.status(400).json({status: 400, success: false, message: "Comment Id is required!"});
    }

    try {
        
        await Comment.findByIdAndDelete({_id:commentId});
        return res.status(200).json({status:200, message: true, message: "Comment was removed!"})

    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
        
    }

}






