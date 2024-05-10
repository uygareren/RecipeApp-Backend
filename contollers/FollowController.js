const Follow = require("../modal/Follow");
const User = require('../modal/User');

exports.addFollowed = async (req, res, next) => {
    const { user_id, followed_id } = req.body;

    if (!user_id || !followed_id) {
        return res.status(400).json({ status: 400, success: false, message: "user_id and followed_id are required!" });
    }

    try {
        let user = await Follow.findOne({ userId: user_id });

        if (user) {
            // Check if followed_id already exists in the array
            if (user.followed.some((item) => String(item._id) === String(followed_id))) {
                return res.status(400).json({ status: 400, success: false, message: "You cannot save this user more than once!" });
            }

            // If not, find the user information from the User model
            const followedUser = await User.findById(followed_id);

            // Push relevant information to the followed array
            user.followed.push({
                _id: followedUser._id,
                name: followedUser.name,
                surname: followedUser.surname,
                image: followedUser.image,
            });

            await user.save();
        } else {
            // If the user is not found, create a new Follow record
            const newUser = new Follow({ userId: user_id, followed: [] });

            // Find the user information from the User model
            const followedUser = await User.findById(followed_id);

            // Push relevant information to the followed array
            newUser.followed.push({
                _id: followedUser._id,
                name: followedUser.name,
                surname: followedUser.surname,
                image: followedUser.image,
            });

            await newUser.save();
        }

        try {
            // Check if user2 exists
            let user2 = await Follow.findOne({ userId: followed_id });

            if (user2) {
                // Check if user_id already exists in the array
                if (user2.follower.some((item) => String(item._id) === String(user_id))) {
                    return res.status(400).json({ status: 400, success: false, message: "You cannot save this user more than once!" });
                }

                const followerUser = await User.findById(user_id);
                user2.follower.push({
                    _id: followerUser._id,
                    name: followerUser.name,
                    surname: followerUser.surname,
                    image: followerUser.image,
                });

                await user2.save();
            } else {
                // If user2 doesn't exist, create a new Follow record
                const newUser2 = new Follow({ userId: followed_id, follower: [] });

                const followerUser = await User.findById(user_id);

                newUser2.follower.push({
                    _id: followerUser._id,
                    name: followerUser.name,
                    surname: followerUser.surname,
                    image: followerUser.image,
                });

                await newUser2.save();
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
        }

        return res.status(200).json({ status: 200, success: true, message: "Saved successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


exports.getAllFollowed = async (req, res, next) => {
    const {user_id} = req.body;

    if(!user_id){
        return res.status(400).json({ status: 400, success: false, message: "userId and follower_id are required!" });
    }

    try {
        const user = await Follow.findOne({userId: user_id});

        if(user){
            return res.status(200).json({status: 200, success: true, message:"Successfull!", followed_data:user.followed});
        }else{
            return res.status(400).json({status: 400, success: false, message:"There is no any user"});
        }

    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
    
    
};

exports.removeFollowed = async(req, res, next) => {
    const { user_id, followed_id } = req.body;

    if (!followed_id || !user_id) {
        return res.status(400).json({ status: 400, success: false, message: "user_id and followed_id are required!" });
    }

    try {
        // Remove followed_id from user_id's followed list
        let user = await Follow.findOne({ userId: user_id });

        if (user) {
            let index = user.followed.findIndex(item => String(item._id) === String(followed_id));

            if (index !== -1) {
                user.followed.splice(index, 1);
                await user.save();
            }
        }

        // Remove user_id from followed_id's follower list
        let followedUser = await Follow.findOne({ userId: followed_id });

        if (followedUser) {
            let index = followedUser.follower.findIndex(item => String(item._id) === String(user_id));

            if (index !== -1) {
                followedUser.follower.splice(index, 1);
                await followedUser.save();
            }
        }

        return res.status(200).json({ status: 200, success: true, message: "Remove is Successful!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}




// Takipçi. (Gelen takipçiler)
exports.addFollower = async (req, res, next) => {

    const {user_id, follower_id} = req.body;

    if(!user_id || !follower_id){
        return res.status(400).json({ status: 400, success: false, message: "user_id and follower_id are required!" });
    }

    try {
        let user = await Follow.findOne({userId: user_id});

        if(user){
           
            if (user.follower.some(item => item._id === follower_id)) {
                return res.status(400).json({ status: 400, success: false, message: "You cannot save this user more than once!" });
            }

             // If not, find the user information from the User model
             const followerUser = await User.findById(follower_id);

              // Push relevant information to the followed array
            user.follower.push({
                _id: followerUser._id,
                name: followerUser.name,
                surname: followerUser.surname,
                image: followerUser.image,
            });
        
            await user.save();
        }else{
             // If the user is not found, create a new Follow record
             const newUser = new Follow({ userId: user_id, follower: [] });

             // Find the user information from the User model
             const followerUser = await User.findById(follower_id);
 
             // Push relevant information to the followed array
             newUser.follower.push({
                 _id: followerUser._id,
                 name: followerUser.name,
                 surname: followerUser.surname,
                 image: followerUser.image,
             });
 
             await newUser.save();
        }

        return res.status(200).json({ status: 200, success: true, message: "Follower saved successfully" });


    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
        
    }
    
};

exports.getAllFollower = async (req, res, next) => {
    const {user_id} = req.body;

    if(!user_id){
        return res.status(400).json({ status: 400, success: false, message: "userId and follower_id are required!" });
    }

    try {
        let user = await Follow.findOne({userId: user_id});

        if(user){
            return res.status(200).json({ status: 200, success:true, message: "Successfull", follower_data: user.follower });
        }else{
            return res.status(400).json({status: 400, success: false, message:"There is no any user"});

        }

    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};

exports.removeFollower = async (req, res, next) => {

    const {follower_id} = req.params;
    const {user_id} = req.body;

    if(!follower_id || !user_id){
        return res.status(400).json({ status: 400, success: false, message: "userId and follower_id are required!" });
    }

    try {
        const user = await Follow.findOne({userId: user_id});

        if(user){
            // check follower id exist or not in the list of followers
            let index = user.follower.indexOf(follower_id);

            if(index !== -1){
                user.follower.splice(index, 1);
                
                await user.save();
                
                return res.status(200).json({status: 200, success: true, message:"Remove is Successfull!"});
            }

        }else{
            return res.status(400).json({status: 400, success: false, message:"There is no any user"});
        }

    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }

}

exports.getAllFollowing = async(req, res, next) => {
    const {user_id} = req.body;

    if(!user_id){
        return res.status(400).json({ status: 400, success: false, message: "userId is required!" });
    }

    
    try {
        let user = await Follow.findOne({userId: user_id});

        if(user){
            return res.status(200).json({ status: 200, success:true, message: "Successfull", data: user });
        }else{
            return res.status(400).json({status: 400, success: false, data:{followed:[], follower:[]}});

        }

    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}
