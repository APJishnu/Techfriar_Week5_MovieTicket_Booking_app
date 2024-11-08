require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

const { connectDB } = require("./config/database");
const Routes = require("./routes/routes");
const authRoutes = require("./routes/auth-routes");

require("./config/passport"); // Load passport configuration

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for the frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Static files setup
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true, 
      maxAge: 3600 * 1000, 
    },
  })
);

// Enable secure cookies behind a proxy (e.g., in production environments)
app.set("trust proxy", 1);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", Routes);
app.use("/api/auth", authRoutes);

// Connect to database and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
