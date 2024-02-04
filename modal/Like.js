const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    userId : ({
        type: String,
        required: true
    }),
    recipeId : ({
        type: String,
        required: true
    }),
    isLike:({
        type: Boolean,
        default: false
    })
},
    {
        timestamps: true, 
    }
);

const Like = mongoose.model("Likes", LikeSchema);
module.exports = Like;