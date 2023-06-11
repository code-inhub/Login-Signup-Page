const express = require("express");
const app = express();
const path = require("path");
// const hbs = require("hbs");
const collection = require("./mongodb");
const templatePath = path.join(__dirname, "../templates");

const bcrypt = require("bcrypt"); 

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup"); 
});


app.post("/signup", async (req, res) => { 
  const salt = await bcrypt.genSalt(12);
  const  secpass= await bcrypt.hash(req.body.password,salt);
  const data = {
    name: req.body.name,
    password: secpass,
  };
  
  await collection.insertMany([data]);
  res.render("home");
});


app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.name });
      
      bcrypt.compare(req.body.password,check.password, function (err, result) {
        if (result) {
            res.render("home");
          }
         else {
          res.render("wrong");
        }   
      });
      
    } catch(e) {
    res.render("wrongdetails")
    console.log(e);
  }

});

app.listen(3000, () => {
  console.log("port connected");
});
