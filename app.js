const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config(); // Load environment variables

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Health check route (Render requirement)
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Atlas connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Mongoose Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

// Home route - list all posts
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.render("home", { posts: posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts");
  }
});

// New post form
app.get("/compose", (req, res) => {
  res.render("compose");
});

// Handle post submission
app.post("/compose", async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  try {
    await post.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving post");
  }
});

// View individual post
app.get("/posts/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.render("post", { title: post.title, content: post.content });
  } catch (err) {
    console.error(err);
    res.status(404).send("Post not found");
  }
});

// Listen on the correct port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});