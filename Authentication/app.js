const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  let { userName, email, password, age } = req.body;

  // encrypting the users password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const userData = await userModel.create({
        userName,
        email,
        password: hash,
        age,
      });

      const token = jwt.sign({ email }, "shh");
      res.cookie("token", token);

      res.send(userData);
    });
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });

  if (!user) return res.send("Something went wrong");
  else
  bcrypt.compare(req.body.password, user.password, (err, result) => {
   if(result) {

     const token = jwt.sign({ email: user.email }, "shh");
     res.cookie("token", token);
     res.send("Login Successful")
   }
  else{
    res.send("Something went wrong")
  }
  })
});

app.listen(3000, () => {
  console.log("Fine Server is running on port 3000");
});
