const express = require('express'),
      router  = express.Router(),
      Campground = require("../models/campground")

router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/index", {
                campgrounds: campgrounds,
                currentUser: req.user
            })
        }
    })
})

router.post("/", function(req, res) {
    const name = req.body.name
    const image = req.body.image
    const desc = req.body.description
    const newCampground = {
        name: name,
        image: image,
        description: desc
    }
    Campground.create(newCampground, function(err, createdCampground) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds")
        }
    })
})

router.get("/new", function(req, res) {
    res.render("campgrounds/new")
})

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/show", {
                campground: foundCampground
            })
        }
    })
})

module.exports = router
