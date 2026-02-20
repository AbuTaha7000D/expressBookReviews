const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// 1. Register a new user
public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(404).json({ message: "Error registering user" });
	}

	if (!isValid(username)) {
		users.push({ "username": username, "password": password });
		return res.status(200).json({ message: "User successfully registered. Now you can login" });
	} else {
		return res.status(403).json({ message: "User already exists!" });
	}
});

// 2. Get the book list available in the shop (TASK 1)
public_users.get('/', function (req, res) {
	// Use JSON.stringify to display output neatly
	return res.send(JSON.stringify(books, null, 4));
});

// 3. Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	const ISBN = req.params.isbn;

	new Promise((resolve, reject) => {
		if (books[ISBN]) {
			resolve(books[ISBN]);
		} else {
			reject("Book not found");
		}
	})
		.then((data) => {
			res.send(JSON.stringify(data, null, 4));
		})
		.catch((err) => {
			res.status(404).json({ message: err });
		});
});

// 4. Get book details based on author
public_users.get('/author/:author', function (req, res) {
	const author = req.params.author;
	let foundBooks = [];

	for (const ISBN in books) {
		if (books[ISBN].author === author) {
			foundBooks.push(books[ISBN]);
		}
	}

	if (foundBooks.length > 0) {
		return res.send(JSON.stringify(foundBooks, null, 4));
	} else {
		return res.status(404).json({ message: "No books found by this author" });
	}
});

// 5. Get all books based on title
public_users.get('/title/:title', function (req, res) {
	const title = req.params.title;
	let foundBooks = [];

	for (const ISBN in books) {
		if (books[ISBN].title === title) {
			foundBooks.push(books[ISBN]);
		}
	}

	if (foundBooks.length > 0) {
		return res.send(JSON.stringify(foundBooks, null, 4));
	} else {
		return res.status(404).json({ message: "No books found with this title" });
	}
});

// 6. Get book review
public_users.get('/review/:isbn', function (req, res) {
	const ISBN = req.params.isbn;

	if (books[ISBN] && books[ISBN].reviews) {
		return res.send(JSON.stringify(books[ISBN].reviews, null, 4));
	} else if (books[ISBN]) {
		return res.status(404).json({ message: "No reviews found for this book." });
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

module.exports.general = public_users;