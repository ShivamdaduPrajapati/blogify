const mongoose = require("mongoose")
const user = require("./user.model")

const blogschema = new mongoose.Schema({
    title : {
        type : "String",
        required : true
    },
    coverImage : {
        type : "String",
    },
    body : {
        type : "String",
        required : true
    },
    createdBy : {
        type :mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "user",
    }
},{timestamps : true})

module.exports = mongoose.model("blog",blogschema)