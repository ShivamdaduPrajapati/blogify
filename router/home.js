const express = require("express")
const usercontroller = require("../controller/user.js")
const cookieParser = require("cookie-parser")
const otpverify = require("../middleware/verifyotp.js")
const blogmodel = require("../model/blog.model.js")
const user = require("../model/user.model.js")
const secretKey = require("../config/token.js")
const jwt = require("jsonwebtoken")
const private = require("../config/mail.js")
const nodemailer = require("nodemailer")

const router = express.Router();

router.get("/", async (req,res)=>{
  
        const blog = await blogmodel.find()
    return res.render("home",{
        user : req.user,
        blogs  : blog 
    })
})
router.get("/signin",(req,res)=>{
    return res.render("signin")
})
router.get("/login",(req,res)=>{
    return res.render("login")
})
router.post("/signin",usercontroller.singin)
router.post("/login",usercontroller.login)
router.get("/logout",(req,res)=>{
    // if(!res.cookies["token"]) return res.status(500).send({message : "! Already logout . First login yourself"})       
    res.clearCookie("token")
    // req.cookie = ""
    return res.redirect("/")
})
router.get("/forgotpassword",(req,res)=>{
    return res.render("confirmemail")
})
const otps = {};

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: private.mail,
        pass: private.pass
    }
});


function generateOTP() {
    return Math.floor(Math.random()*10000)+1
}


function sendOTPEmail(to, otp) {
    const mailOptions = {
        from: private.mail,
        to: to,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    return transporter.sendMail(mailOptions);
}

// Endpoint to request an OTP
router.post('/request-otp', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    otps[email] = otp; // Store OTP

    try {
        await sendOTPEmail(email, otp);
        return res.render("otp",{
            email:email
        })
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending OTP');
    }
});

// Endpoint to verify the OTP
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    console.log(email)
    console.log(otp)
    if (otps[email] && otps[email] === Number(otp)) {
        delete otps[email]; // OTP verified, remove it from store
        return res.render("changepassword",{
            email:email
        })
    } else {
        res.status(400).send('Invalid OTP');
    }
});
// router.post("/forgotpassword",usercontroller.forgotpassword)
// // router.get("/verify",(req,res)=>{
// //     return res.render("changepassword")
// // })
// router.post("/verify",otpverify,(req,res)=>{
//     return res.render("changepassword")
// })
router.post("/changepassword",usercontroller.changepassword)

module.exports = router