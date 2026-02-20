const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// ---------------------------------------------------------
// Task 10: Get the book list available in the shop 
// Implemented using Async/Await with Promises
// ---------------------------------------------------------
public_users.get('/', async function (req, res) {
	try {
		const booksData = await new Promise((resolve, reject) => {
			if (books && Object.keys(books).length > 0) {
				resolve(books);
			} else {
				reject("No books found in database");
			}
		});
		return res.send(JSON.stringify(booksData, null, 4));
	} catch (error) {
		console.error("Error fetching books:", error);
		return res.status(500).json({ message: "Internal server error", error: error });
	}
});

// ---------------------------------------------------------
// Task 11: Get book details based on ISBN
// Implemented using Async/Await with Promises
// ---------------------------------------------------------
public_users.get('/isbn/:isbn', async function (req, res) {
	const ISBN = req.params.isbn;

	try {
		const bookData = await new Promise((resolve, reject) => {
			if (books[ISBN]) {
				resolve(books[ISBN]);
			} else {
				reject("Book not found");
			}
		});
		return res.send(JSON.stringify(bookData, null, 4));
	} catch (error) {
		return res.status(404).json({ message: error });
	}
});

// ---------------------------------------------------------
// Task 12: Get book details based on Author
// Implemented using Async/Await with Promises (Updated)
// ---------------------------------------------------------
public_users.get('/author/:author', async function (req, res) {
	const author = req.params.author;

	try {
		// إنشاء Promise للبحث عن الكتب وانتظار اكتمال البحث
		const foundBooks = await new Promise((resolve, reject) => {
			let results = [];

			// التحقق من وجود بيانات الكتب
			if (!books || Object.keys(books).length === 0) {
				reject("No books available");
				return;
			}

			// التكرار عبر جميع الكتب للبحث عن المؤلف
			for (const ISBN in books) {
				if (books.hasOwnProperty(ISBN) && books[ISBN].author === author) {
					results.push(books[ISBN]);
				}
			}

			if (results.length > 0) {
				resolve(results);
			} else {
				reject("No books found by this author");
			}
		});

		// إذا نجح البحث، نرجع النتائج
		return res.send(JSON.stringify(foundBooks, null, 4));

	} catch (error) {
		// إذا فشل البحث (لا نتائج)، نرجع خطأ 404
		return res.status(404).json({ message: error });
	}
});

// ---------------------------------------------------------
// Task 4: Get all books based on title
// (Will be updated in Task 13)
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