const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

// Import routes
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session configuration
app.use("/customer", session({
	secret: "fingerprint_customer",
	resave: true,
	saveUninitialized: true
}));

// Authentication Middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
	if (req.session && req.session.authorization) {
		return next();
	} else {
		return res.status(403).json({ message: "User not logged in" });
	}
});

const PORT = 5000;

// Register routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));