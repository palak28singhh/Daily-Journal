// app.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// EJS & Public folder
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB Atlas Connection
const uri = "mongodb+srv://palak28singhh:bcuVD5pOQRW5Vjtv@clusternew.j8tv1ii.mongodb.net/dailyJournalDB?retryWrites=true&w=majority&appName=ClusterNEW";

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);

// Routes
app.get("/", (req, res) => {
  Post.find({})
    .then(posts => {
      res.render("home", { posts: posts });
    })
    .catch(err => console.log(err));
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });
  post.save()
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;
  Post.findById(requestedPostId)
    .then(post => {
      res.render("post", { title: post.title, content: post.content });
    })
    .catch(err => console.log(err));
});

// Start Server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});