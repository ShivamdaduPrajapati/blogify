const tokencheck = require("../service/auth.service")

function checkforAuthentication(cookiename){
    return (req,res,next)=>{
        const tokencookie = req.cookies[cookiename]
        try{
            const userpayload = tokencheck.verify(tokencookie)
            req.user = userpayload
        }catch(err){}
        next()
    }
}
function checkforuserAuthentication(cookiename){
    return (req,res,next)=>{
        const tokencookie = req.cookies[cookiename]
        if(!tokencookie) return res.redirect("/login")
        try{
            const userpayload = tokencheck.verify(tokencookie)
            if(!userpayload) return res.redirect("/login")
            req.user = userpayload
        }catch(err){}
        next()
    }
}
module.exports = {
    checkforAuthentication,
    checkforuserAuthentication
}

// exports.lessstrictcheck = (req,res,next)=>{
   
//     const check = tokencheck(req.cookie)

//     if(!check) return res.render("login")
//     res.render("home")
//     next()
// }