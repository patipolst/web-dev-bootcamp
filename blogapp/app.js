const express           = require('express'),
      app               = express(),
      expressSanitizer  = require("express-sanitizer"),
      methodOverride    = require("method-override"),
      bodyParser        = require("body-parser"),
      mongoose          = require("mongoose")

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(express.static("public"))
app.use(methodOverride("_method"))
mongoose.connect("mongodb://localhost/yelp_camp")

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  createdAt: { type: Date, default: Date.now }
})

const Blog = mongoose.model("Blog", blogSchema)

const list = []

app.listen(3000, function() {
  console.log("Server has started...")
})

app.get("/", function(req, res) {
  res.render("landing")
})

app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if(err) {
      console.log(err)
    } else {
      res.render("index", { blogs: list })
    }
  })
})

app.get("/blogs/new", function(req, res) {
  res.render("new")
})

app.post("/blogs", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.create(req.body.blog, function(err, createdBlog) {
    if (err) {
      res.render("new")
    } else {
      res.redirect("/blogs")
    }
  })
})

app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err)
    } else {
      res.render("show", { blog: foundBlog })
    }
  })
})

app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs")
    } else {
      res.render("edit", { blog: foundBlog })
    }
  })
})
}

app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      res.redirect("/blogs")
    } else {
      res.redirect(`blogs/${req.params.id}`)
    }
  })
})

app.delete("/blogs/:id", function(req, res) {
  Blog.findByIdAndDelete(req.params.id, function(err, updatedBlog) {
    if (err) {
      res.redirect("/blogs")
    } else {
      res.redirect("/blogs")
    }
  })
})
