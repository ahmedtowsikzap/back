require('dotenv').config();
console.log(process.env.MONGO_URI); // This will show if MONGO_URI is loaded correctly

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const sheetRoutes = require('./routes/sheetRoutes');

// Create an Express application
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL
}));

app.use(bodyParser.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

// Connect to MongoDB and start the server
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/sheets', sheetRoutes);

app.get('/', (req, res) => {

  res.send("server is running")
})
// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
