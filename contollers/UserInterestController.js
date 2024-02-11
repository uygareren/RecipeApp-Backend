const UserInterest = require("../modal/UserInterest");

exports.postUserInterest = async (req, res, next) => {

    const {userId, interestedWorldCuisines} = req.body;
    
    if(!userId){
        return res.status(400).json({status:400, success:false, message:"Id is required!"});
    }

    try {
        const userIntObj = await new UserInterest({
            userId : userId ,
            interestedWorldCuisines : interestedWorldCuisines
        });
        
        await userIntObj.save();

        return res.status(200).json({status:200, success:true, message:"Successfull!"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({status:400, success:false, message:"Error!"});
    }
}

exports.getUserInterest = async (req, res, next) => {
    const user_id = req.params.user_id;

    if (!user_id) {
        return res.status(400).json({ status: 400, success: false, message: "Id is required!" });
    }

    try {
        const userInterestData = await UserInterest.find({ userId: user_id });

        console.log(userInterestData);

        if (userInterestData.length === 0) {
            return res.status(400).json({ status: 400, success: false, message: "There are no any data for this user" });
        } else {
            const interestedWorldCuisines = userInterestData.map(item => item.interestedWorldCuisines);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Successfull!",
                data: interestedWorldCuisines
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: "Error!" });
    }
}

exports.updateUserInterest = async (req, res, next) => {
    const {user_id, newData} = req.body;

    if(!user_id){
        return res.status(400).json({ status: 400, success: false, message: "Id is required!" });
    }

    try {
        const userInterestObj = await UserInterest.findOne({userId:user_id});

        if(!userInterestObj){
            return res.status(400).json({ status: 400, success: false, message: "There are no any data for this user" });

        }

        userInterestObj.interestedWorldCuisines = [...newData];
        await userInterestObj.save();

        return res.status(200).json({status:200, success:true, message:"Successfull!"})

    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Error!" });
    }
}
