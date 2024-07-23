const express = require("express");
const app = express();

const path = require("path");

const userModel = require('./models/user')

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});


// read users
app.get('/read', async(req,res) => {
  const allUsers = await userModel.find()
  res.render('read',{users: allUsers})
})


// create users
app.post('/create',async (req,res)=>{
 let userData = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    imgUrl: req.body.imgUrl
  })

  res.redirect('/read')
})

// update users 
app.get('/edit/:userId', async (req,res) => {
 const updatedUser = await userModel.findOne({_id :  req.params.userId})
 res.render('update',{user: updatedUser})
})

app.post('/updateData/:userId',async (req,res) => {
  let {name, email,imgUrl} = req.body;
  // console.log(req.body)
  const updateData = await userModel.findOneAndUpdate({_id : req.params.userId} , {name, email, imgUrl} , {new: true});
  res.redirect('/read')
  // res.send(updateData)
})

// delete users 
app.get('/read/:userId',async (req,res)=>{
  const deleteUser = await userModel.findOneAndDelete({_id: req.params.userId})
  res.redirect('/read')
})

app.listen(3000);
