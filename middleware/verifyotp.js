const usercontroller = require("../controller/user")

const checkotp = (req,res,next)=>{
    const {email,otp} = req.body
    console.log(email)
    console.log(otp)
    console.log(usercontroller.mailotp)
    if(usercontroller.mailotp != otp){
        return res.status(400).send("wrond otp")
    }
    next()
}
module.exports = checkotp