const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    followed: [
        {
            type: String
        }
    ],
    follower: [
        {
            type: String
        }
    ]
});

const Follow = mongoose.model("Follow", FollowSchema);

module.exports = Follow;
