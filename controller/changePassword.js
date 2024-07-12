const user = require("../model/user.model.js")
const secretKey = require("../config/token.js")
const jwt = require("jsonwebtoken")
const private = require("../config/mail.js")
const nodemailer = require("nodemailer")


// async function forgotpassword(req,res){
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: private.mail,
//             pass: private.pass
//         }
//     })
//     const email = req.body.email
//     const userbody = req.body
//     console.log(userbody)
//     const otp = Math.floor(Math.random()*10000)+1
//     generatedOtp[email] = otp
//     const mailOptions = {
//         from: "shivamdadu928@gmail.com",
//         to: email,
//         subject: "code for reset password",
//         text: `One time password for reseting password ${otp}`
//     };
//     console.log(mailOptions)
//     try {
//         await transporter.sendMail(mailOptions);
//         console.log("Mail send")
//         return res.render("confirmemail")
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Error sending email');
//     }
// }

const otps = {};

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: private.mail,
        pass: private.pass
    }
});

// Generate OTP
function generateOTP() {
    return Math.floor(Math.random()*10000)+1
}

// Send OTP email
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
app.post('/request-otp', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    otps[email] = otp; // Store OTP

    try {
        await sendOTPEmail(email, otp);
        res.status(200).send('OTP sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending OTP');
    }
});

// Endpoint to verify the OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otps[email] && otps[email] === otp) {
        delete otps[email]; // OTP verified, remove it from store
        res.status(200).send('OTP verified successfully');
    } else {
        res.status(400).send('Invalid OTP');
    }
});