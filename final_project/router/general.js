const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// ---------------------------------------------------------
// Task 10: Get the book list available in the shop 
// Implemented using Async/Await with Promises
// ---------------------------------------------------------
public_users.get('/', async function (req, res) {
	try {
		// إنشاء Promise لمحاكاة عملية جلب بيانات غير متزامنة
		const booksData = await new Promise((resolve, reject) => {
			if (books && Object.keys(books).length > 0) {
				resolve(books);
			} else {
				reject("No books found in database");
			}
		});

		// إرجاع البيانات منسقة باستخدام JSON.stringify
		return res.send(JSON.stringify(booksData, null, 4));

	} catch (error) {
		console.error("Error fetching books:", error);
		return res.status(500).json({ message: "Internal server error", error: error });
	}
});

// ---------------------------------------------------------
// Task 2: Get book details based on ISBN
// Implemented using Promises (as required previously)
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// Task 3: Get book details based on author
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// Task 4: Get all books based on title
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// Task 5: Get book review
// ---------------------------------------------------------
public_users.get('/review/:isbn', function (req, res) {
	const ISBN = req.params.isbn;

	if (books[ISBN]) {
		let reviews = books[ISBN].reviews;
		if (reviews && Object.keys(reviews).length === 0) {
			return res.status(404).json({ message: "No reviews found for this book." });
		}
		return res.send(JSON.stringify(reviews, null, 4));
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

module.exports.general = public_users;