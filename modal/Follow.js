const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    followed: [
        {
            _id: {
                type: String
            },
            name: {
                type: String
            },
            surname: {
                type: String
            },
            image: {
                type: Buffer,  
                default: null
            }
        }
    ],
    
    follower: [
        {
            _id: {
                type: String
            },
            name: {
                type: String
            },
            surname: {
                type: String
            },
            image: {
                type: Buffer,  
                default: null
            }
        }
    ],
});

const Follow = mongoose.model("Follow", FollowSchema);

module.exports = Follow;
