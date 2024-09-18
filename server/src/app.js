require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Routes = require('./routes/routes');
const authRoutes = require('./routes/auth-routes'); // Add auth routes
const passport = require('passport');



const session = require('express-session');
const { db } = require('./config/database')
require('./config/passport');  // Add the passport configuration

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(cors({
  origin: 'https://techfriar-week5-movie-ticket-booking-app-f73m.vercel.app', // Include 'https://' and full domain
  methods: 'GET,POST,PUT,DELETE',
  credentials: true // Allow cookies
}));

app.use('/uploads', express.static('uploads'));


// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true },

}));

app.use(passport.initialize());
app.use(passport.session());

// Routes


app.use('/api/', Routes); // Add the new movie routes
app.use('/api/auth/', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
});
