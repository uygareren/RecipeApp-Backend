const mongoose = require("mongoose");

const WorldCuisinesSchema = new mongoose.Schema({
    cuisines_name:[{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        type: { type: String }
    
    }
    ]
})

const WorldCuisines = new mongoose.model("WorldCuisines", WorldCuisinesSchema);
module.exports = WorldCuisines;