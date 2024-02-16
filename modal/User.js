const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    interests: [{
        type: String,
        default: null
    }],
    image:{
        type: Buffer,
        default: null
    },
    phone:{
        type: String,
        default: null
    },
    country:{
        type: String,
        default: null
    },
    city:{
        type: String,
        default: null
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
