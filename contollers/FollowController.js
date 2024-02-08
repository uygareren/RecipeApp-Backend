const Follow = require("../modal/Follow");

exports.addFollowed = async (req, res, next) => {
    const { user_id, followed_id } = req.body;

    if (!user_id || !followed_id) {
        return res.status(400).json({ status: 400, success: false, message: "user_id and followed_id are required!" });
    }

    try {
        let user = await Follow.findOne({ userId: user_id });

        if (user) {
            console.log("userrrrrrr", user);

            // Check if followed_id already exists in the array
            if (user.followed.includes(followed_id)) {
                return res.status(400).json({ status: 400, success: false, message: "You cannot save this user more than once!" });
            }

            // If not, push followed_id directly to the array
            user.followed.push(followed_id);
            
            await user.save();
        } else {
            const newUser = new Follow({ userId: user_id, followed: [followed_id] });
            await newUser.save();
        }

        return res.status(200).json({ status: 200, success: true, message: "Followed saved successfully" });
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
    const {followed_id} = req.params;
    const {user_id} = req.body;

    if(!followed_id || !user_id){
        return res.status(400).json({ status: 400, success: false, message: "userId and follower_id are required!" });
    }


    try {
        const user = await Follow.findOne({userId: user_id});

        if(user){
            let index = user.followed.indexOf(followed_id);
            
            if(index !== -1){
                user.followed.splice(index, 1);
                await user.save();
                
                return res.status(200).json({status: 200, success: true, message:"Remove is Successfull!"});
            } else {
                throw new Error("User not found in following list");
            }

        }else{
            return res.status(400).json({status: 400, success: false, message:"There is no any user"});
        }
        
    } catch (error) {
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
            if(user.follower.includes(follower_id)){
                return res.status(400).json({ status: 400, success: false, message: "You cannot save this user more than once!" });
            }

            // If not, push follower_id directly to the array
            user.follower.push(follower_id);
        
            await user.save();
        }else{
            const newUser = await Follow({userId: user_id, follower:[follower_id]});
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
