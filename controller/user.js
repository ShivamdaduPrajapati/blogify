const user = require("../model/user.model.js")
const {createhash,comparehash} = require("../service/hash.js")
const secretKey = require("../config/token.js")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const private = require("../config/mail.js")
const nodemailer = require("nodemailer")
const hash = require("../service/hash.js")

const generatedOtp = {};

exports.singin = async (req,res)=>{
    const body = req.body
 
    const hashpassword = await createhash(body.password)
    try{
        const createduser = await user.create({
            name : body.name,
            email : body.email,
            password : hashpassword,
        }) 
        return res.redirect("/login")
    }catch(err){
        return res.status(500).send({
            message : "user can't be created"
        })
    }
}

exports.login = async (req,res)=>{
    const {email,password} = req.body
    try{
        const userdetail = await user.findOne({email})
        const name = userdetail.name
        const id = userdetail._id
        
   
        const verify = await comparehash(userdetail.password,password)
        if(!verify) return res.render("login",{
            message : "Incorrect credentials"
        })
    
        const token = await jwt.sign({
            name,email,password,id
        },secretKey)
        
        res.cookie("token" , token)
        // console.log("req user :" ,req.user)
        return res.redirect("/")
       
    }catch(err){
        console.log("user not found")
        return res.render("login", {
            message : "Email Id doesn't exists"
        })
    }
}

exports.changepassword =async (req,res)=>{
    const {Useremail, newpassword} = req.body;
 
    const hashpassword = await hash.createhash(newpassword)
  
    const filter = {email : Useremail}
    const update = {password : hashpassword}
    const userdetail = await user.findOneAndUpdate(filter,update,{returnOriginal: false})
    // console.log(userdetail)
    const name = userdetail.name
    const Email = userdetail.email
    const password = userdetail.password
    
    const id = userdetail._id
    const token = await jwt.sign({
        name,Email,password,id
    },secretKey)

    res.cookie("token" , token)
    // console.log("req user :" ,req.user)
    return res.redirect("/login")

}

