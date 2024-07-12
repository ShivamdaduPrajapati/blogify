const express = require("express")
const blogmodel = require("../model/blog.model")
const comment = require("../model/comment")
const usermodel = require("../model/user.model")

const router = express.Router()

router.get("/:id", async (req, res) => {
    const requestblog = await blogmodel.findById(req.params.id)
    const allcomment = await comment.find({ commentedOn: req.params.id })
    const createduser = await usermodel.findById(requestblog.createdBy)
    const username = createduser.name.toUpperCase()
    return res.render("userblog", {
        user : req.user,
        username: username,
        blog: requestblog,
        comments: allcomment
    })
})
router.post("/:id", async (req, res) => {
    const blogid = req.params.id.trim
    const id = req.user.id
    const userdetail = await usermodel.findById(id)
    const image = userdetail.profilePicture
    console.log(image)
    const createdcomment = await comment.create({
        name: req.user.name,
        commentedOn: req.params.id,
        commentedBy: req.user.id,
        commentImg : image,
        commentBody: req.body.body
    })
    return res.redirect("/");
})
router.get("/delete/:id", async (req, res) => {
    
    const requestblog = await blogmodel.findById(req.params.id)
    const user = req.user.id
    const request = requestblog.createdBy

    if (requestblog.createdBy == req.user.id) {
        const deleteblog = await blogmodel.deleteOne({ "_id": requestblog.id })
        return res.redirect("/")
    }
    else return res.redirect("/")
})
router.get("/edit/:id",async(req,res)=>{
    const requestblog = await blogmodel.findById(req.params.id)
    if(requestblog.createdBy == req.user.id){
        return res.render("edit",{
            user:req.user,
            blog : requestblog
        })
    }
    else return res.redirect("/")
   
})
router.post("/edit/:id",async (req,res)=>{
    // const Id = req.params.id
    // console.log(Id)
    const requestblog = await blogmodel.findById(req.params.id)

    if (requestblog.createdBy == req.user.id) {
        const editblog = await blogmodel.findByIdAndUpdate({ "_id": requestblog.id },{
            title : req.body.title,
            body : req.body.body
        })
    }
    return res.redirect("/")
})

module.exports = router