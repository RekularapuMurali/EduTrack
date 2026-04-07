const express = require('express');
const cors    = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const app = express();

// Connect to MongoDB
connectDB();

// Global middleware
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'EduTrack API is running', status: 'ok' });
});

// API Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/students',    require('./routes/students'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/activities',  require('./routes/activities'));
app.use('/api/sessions',    require('./routes/sessions'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler (4 params required)
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));