const express = require("express")
const mongoose = require("mongoose")
const userrouter = require("./router/user.js")
const homerouter = require("./router/home.js")
const blogrouter = require("./router/blog.js")
const {checkforAuthentication,checkforuserAuthentication} = require("./middleware/auth.js")
const path = require("path")
const cookieParser = require("cookie-parser")

const PORT = 8008
const app = express()

mongoose.connect("mongodb://127.0.0.1:27017/blog")
const db = mongoose.connection
db.on("error",()=>{
    console.log("error while connecting with db")
})
db.once("open",()=>{
    console.log("connection established with db")
})

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : false}))
app.use(checkforAuthentication("token"))
app.use(express.static(path.resolve("./public")))

app.use("/",homerouter)
app.use("/user",checkforuserAuthentication("token"),userrouter)
app.use("/blog",checkforuserAuthentication("token"),blogrouter)


app.listen(PORT,()=>{
    console.log("server started at port",PORT)
})