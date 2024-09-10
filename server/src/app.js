require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/admin/admin-routes');
const userRoutes= require('./routes/user/user-routes');
const session = require('express-session');
const { db } = require('./config/database')

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',  // Adjust this to your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true                 // Allow cookies
}));



app.use('/uploads', express.static('uploads'));


// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true },
  
}));


// Routes


app.use('/api/admin/', adminRoutes); // Add the new movie routes
app.use('/api/', userRoutes); // Add the new movie routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
