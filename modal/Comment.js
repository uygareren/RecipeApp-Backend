const mongoose = require("mongoose");


const CommentSchema = new mongoose.Schema({
    userId : ({
        type: String,
        required: true
    }),
    postId : ({
        type: String,
        required: true
    }),
    comment:({
        type: String,
        required:true
    }),
    
},
    {
        timestamps: true, 
    }
  );

const Comment = mongoose.model("Comments", CommentSchema);
module.exports = Comment;

