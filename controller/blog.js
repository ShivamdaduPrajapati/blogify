const blogmodel = require("../model/blog.model")
const multer = require("multer")

exports.createblog = (req,res)=>{
    const {title, coverImage,body} = req.body
}