const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Simple health check route for Render
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Replace with your actual MongoDB connection string in .env
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

// Example route
app.get('/', (req, res) => {
  res.send('Hello from Daily Journal App!');
});

// Listen on the correct port (important for Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
