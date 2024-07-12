const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    "name" : {
        type : String,
        required : true,
    },
    "email" : {
        type : String,
        required : true,
        unique : true,
    },
    "password" : {
        type : String,
        required : true,
    },
    "profilePicture": {
        type: String,
        default: "https://as2.ftcdn.net/v2/jpg/01/18/03/35/1000_F_118033506_uMrhnrjBWBxVE9sYGTgBht8S5liVnIeY.jpg"
    },
},{timestamps : true})

module.exports = mongoose.model("user",userschema)