const mongoose = require("mongoose");

const UserInterestSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    interestedWorldCuisines:[
        {type: String}
    ]
});

const UserInterest = new mongoose.model("UserInterest", UserInterestSchema);
module.exports=UserInterest;