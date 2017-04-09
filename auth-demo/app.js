const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user")


app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(__dirname + "/public"))
app.use(require("express-session")({
  secret: "GG secret",
  resave: false,
  saveUnitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// app.use(methodOverride("_method"));
// app.use(flash());
mongoose.connect("mongodb://localhost/auth_demo")

app.listen(3000, function() {
    console.log("Server has started...")
})

app.get("/", function(req, res) {
    res.render("home")
})

app.get("/register", function(req, res) {
    res.render("register")
})

app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret")
})

app.post("/register", function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if(err) {
      console.log(err);
      return res.redirect("/register")
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/secret")
    })
  })
})

app.get("/login", function(req, res) {
    res.render("login")
})

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), function(req, res) {
})

app.get("/logout", function(req, res) {
    req.logout()
    res.redirect("/")
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}
