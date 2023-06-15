const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");

const collection = require("./model/mongodb");
const templatePath = path.join(__dirname, "./view");
const bcrypt = require("bcrypt");
const contacts = require("./model/contactsSchema");
// var uniqueId1  ;

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));
app.use(
  sessions({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false, 
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.name });

    const result = await bcrypt.compare(req.body.password, check.password);
    if (result) {
      if (check.is_admin == 1) {
        req.session.uniqueId = check._id;
        res.render("admin");
      } else {
        req.session.uniqueId = check._id;
        // res.render("home");
        // console.log(req.session.uniqueId);
        res.redirect("/user-dashboard");
      }
    } else {
      res.render("wrong");
    }
  } catch (e) {
    res.render("wrongdetails");
    console.log(e);
  }
});

app.post("/addcontact", async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      phone_no: req.body.phone_no,
      email: req.body.email,
      UserId: req.session.uniqueId,
    };
    await contacts.insertMany([data]);
    // res.send(req.session.uniqueId);
    res.redirect("/user-dashboard");
  } catch (err) {
    console.log(err);
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/user-dashboard", async (req, res) => {
  const user_id = req.session.uniqueId;
  // res.send(user_id);
  res.render("home");
});

app.post("/signup", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.name });

    if (!check) {
      const salt = await bcrypt.genSalt(12);
      const secpass = await bcrypt.hash(req.body.password, salt);
      const data = {
        name: req.body.name,
        password: secpass,
      };

      await collection.insertMany([data]);
      res.render("home");
    } else {
      res.render("already");
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.get("/showData", async (req, res) => {
  try {
    const data = await contacts.find({ UserId: req.session.uniqueId });
    res.render("showData", { contacts: data });
  } catch (err) {
    console.log(err);
  }
});

// app.get("/addcontact", (req, res) => {
//   console.log(res.body);
//   console.log("add contact body");
// });

app.listen(3000, () => {
  console.log("port connected");
});
