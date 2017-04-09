const express = require('express'),
      router  = express.Router({ mergeParams: true }),
      Campground = require("../models/campground"),
      Comment = require("../models/comment")


router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {
                campground: foundCampground
            })
        }
    })
})

router.post("/", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function(err, createdComment) {
                if (err) {
                    console.log(err)
                } else {
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect(`/campgrounds/${foundCampground._id}`)
                }
            })
        }
    })
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}

module.exports = router
