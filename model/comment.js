const mongoose = require("mongoose")

const comment = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    commentedOn : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "blog",
        required : true,
    },
    commentedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true,
    },
    commentImg:{
        type : String,
        default: "https://as2.ftcdn.net/v2/jpg/01/18/03/35/1000_F_118033506_uMrhnrjBWBxVE9sYGTgBht8S5liVnIeY.jpg"
    },
    commentBody : {
        type : String,
        required : true,
    },
},{timestamps : true})

module.exports = mongoose.model("comment",comment)