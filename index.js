import mongoose from "mongoose";
import express from "express";
import cors from 'cors';
import userRouter from "./Routes/User.js";
import blogRouter from "./Routes/Blogs.js";
import commentRouter from "./Routes/comment.js";
import User from "./Module/Module.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // Use environment port or default to 5000

// Database connection with environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://newuser:1234@blogapp.p4hhvik.mongodb.net/newdb?retryWrites=true&w=majority&appName=blogapp';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB failed to connect:", error);
  });

// CORS configuration for production
app.use(cors({
  origin: [
    'http://localhost:5173', // Development
    'http://localhost:3000', // Development
    'https://blog.schemesinindia.in', // Production frontend
    process.env.FRONTEND_URL // Additional frontend URL from environment
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blog API Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api', userRouter);
app.use('/api', blogRouter);
app.use('/api/comment', commentRouter);

// Get all users endpoint
app.get("/api/user", async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords for security
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: "Failed to fetch users", message: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});