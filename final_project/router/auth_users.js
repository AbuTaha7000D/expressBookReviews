const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if username exists
const isValid = (username) => {
	let userswithsamename = users.filter((user) => {
		return user.username === username;
	});
	if (userswithsamename.length > 0) {
		return true;
	} else {
		return false;
	}
}

// Function to check credentials
const authenticatedUser = (username, password) => {
	let sameusers = users.filter((user) => {
		return user.username === username && user.password === password;
	});
	if (sameusers.length > 0) {
		return true;
	} else {
		return false;
	}
}

// Route: Register (Moved here logically, but kept in general.js as per skeleton usually, 
// however skeleton had it in general.js, so we leave POST /register in general.js 
// and only handle Login here as per standard separation, 
// BUT looking at your previous code, Register was in general.js. 
// Let's ensure Login works here.)

// Route: Login
regd_users.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(404).json({ message: "Error logging in" });
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign({
			password: password
		}, 'access_token', { expiresIn: 60 * 60 });

		req.session.authorization = {
			accessToken: accessToken,
			username: username
		};

		return res.status(200).send("User successfully logged in");
	} else {
		return res.status(403).json({ message: "Invalid username or password" });
	}
});

// Placeholder for Add Review (Will be implemented in next tasks)
regd_users.put("/auth/review/:isbn", (req, res) => {
	return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;