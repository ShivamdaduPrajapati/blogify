const express = require("express")
const blogmodel = require("../model/blog.model.js")
const usermodel = require("../model/user.model.js")
const router = express.Router()
const secretKey = require("../config/token.js")
const jwt = require("jsonwebtoken")
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();
const path = require("path")

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null,path.resolve(`./public/blog/`))
//     },
//     filename: function (req, file, cb) {
//       const name = `${Date.now()}-${file.originalname}`
//       cb(null,name)
//     }
//   })

//   const profilestorage = multer.diskStorage({
//     destination : function(req,file,cb){
//       cb(null,path.resolve(`./public/profilepicture/`))
//     },
//     filename: function(req,file,cb){
//       const name = `${Date.now()}-${file.originalname}`
//       cb(null,name)
//     } 
//   })
// const upload = multer({ storage: storage })
// const profile = multer({storage : profilestorage})
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// router.post("/add-blog",upload.single("coverImage"),async (req,res)=>{
//   const {title,body} = req.body
//   const blog = await blogmodel.create({
//     title,
//     body,
//     createdBy : req.user.id,
//     coverImage :  `/blog/${req.file.filename}`
//   })
//   return res.redirect("/")
// })
const url = {};
router.post("/add-blog", upload.single("coverImage"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { title, body } = req.body;
  (async function upload() {
    const uploadStream = await cloudinary.uploader.upload_stream(
      { folder: 'coverImage' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Upload to Cloudinary failed' });
        }
        url[req.user.id] = result.secure_url
        console.log(`uploadStream : ${url[req.user.id]}`)

      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  })()
  setTimeout(async function () {
    console.log(`outside uploadStream${url[req.user.id]}`)
    const blog = await blogmodel.create({
      title,
      body,
      createdBy: req.user.id,
      coverImage: `${url[req.user.id]}`
    })
    console.log(blog)
    delete url[req.user.id];
    return res.redirect("/")
  }, 2000)


})
router.get("/blog", async (req, res) => {
  const user = req.user
  const blog = await blogmodel.find({ createdBy: user.id })
  return res.render("home", {
    user: req.user,
    blogs: blog
  })
})
router.get("/dashboard", async (req, res) => {
  const user = req.user

  const email = user.email
  const blog = await blogmodel.find({ createdBy: user.id })
  const userdetail = await usermodel.findOne({ email })
  req.user.name = userdetail.name

  const image = userdetail.profilePicture

  return res.render("dashboard", {
    user: req.user,
    image: image,
    blogs: blog
  })
})
router.get("/editprofile", async (req, res) => {
  const user = req.user
  const email = user.email
  const userdetail = await usermodel.findOne({ email })
  // const image = 
  return res.render("editprofile", {
    user: user,
    image: userdetail.profilePicture
  })
})
router.post("/editprofile", upload.single("profileimage"), async (req, res) => {

  const { name } = req.body
  const id = req.user.id
  if (!req.file) {
    const userdetail = await usermodel.findByIdAndUpdate(id, { $set: { name: name } })
    // const userdetail = await usermodel.findOne({ _id: id })

    const blog = await blogmodel.find({ createdBy: id })
    const email = userdetail.email
    const password = userdetail.password
    const token = await jwt.sign({
      name, email, password, id
    }, secretKey)

    res.cookie("token", token)
    return res.redirect("/user/dashboard")
   
  }

  try {
    const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'profileimage' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Upload to Cloudinary failed' });
        }
        else{
          resolve(result)
        }
        url[req.user.id] = result.secure_url
        console.log(`uploadStream : ${url[req.user.id]}`)
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    console.log(`uploadStream : ${url[req.user.id]}`)
  })
} catch (error) {
  console.error('Cloudinary upload error:', error);
  res.status(500).json({ error: 'Upload to Cloudinary failed' });
}

    const image=url[req.user.id];
    console.log(image)
    const userdetail = await usermodel.findByIdAndUpdate(id, { $set: { name: name, profilePicture: image } })
    // const blog = await blogmodel.find({ createdBy: id })
    const email = userdetail.email
    const password = userdetail.password
    const token = await jwt.sign({
      name, email, password, id
    }, secretKey)
    delete url[req.user.id];
 
    res.cookie("token", token)
    return res.redirect("/user/dashboard")
     
// const userdetail = await usermodel.findOne({ _id: id })
 })
  router.get("/add-blog", (req, res) => {
    return res.render("blog", {
      user: req.user
    })
  })


  module.exports = router