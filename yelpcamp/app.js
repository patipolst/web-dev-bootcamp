const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds")

const campgroundRoutes  = require("./routes/campground"),
      commentRoutes     = require("./routes/comments"),
      indexRoutes       = require("./routes/index")

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(__dirname + "/public"))
// app.use(methodOverride("_method"));
// app.use(flash());

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

app.use(function(req, res, next) {
  res.locals.currentUser = req.user
  next()
})

app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)
app.use("/", indexRoutes)

mongoose.connect("mongodb://localhost/yelp_camp")
seedDB()

app.listen(3000, function() {
    console.log("Server has started...")
})
