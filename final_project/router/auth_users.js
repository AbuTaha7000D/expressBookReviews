const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// دالة للتحقق مما إذا كان اسم المستخدم موجوداً بالفعل
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

// دالة للتحقق من صحة اسم المستخدم وكلمة المرور
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

// --- Route: تسجيل مستخدم جديد (Register) ---
regd_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(400).json({ message: "Username and password are required" });
	}

	if (isValid(username)) {
		return res.status(409).json({ message: "User already exists!" });
	} else {
		users.push({ "username": username, "password": password });
		return res.status(200).json({ message: "User successfully registered. Now you can login" });
	}
});

// --- Route: تسجيل الدخول (Login) - Task 7 ---
regd_users.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(400).json({ message: "Username and password are required" });
	}

	if (authenticatedUser(username, password)) {
		// إنشاء JWT Token
		let accessToken = jwt.sign({
			password: password
		}, 'access_token', { expiresIn: 60 * 60 });

		// حفظ الـ Token ومعلومات المستخدم في الـ Session
		req.session.authorization = {
			accessToken: accessToken,
			username: username
		};

		return res.status(200).send("User successfully logged in");
	} else {
		return res.status(403).json({ message: "Invalid username or password" });
	}
});

// --- Route: إضافة أو تعديل مراجعة كتاب - Task 8 ---
regd_users.put("/auth/review/:isbn", (req, res) => {
	const ISBN = req.params.isbn;
	const review = req.body.review;

	// التحقق من وجود الجلسة واسم المستخدم
	if (!req.session || !req.session.authorization || !req.session.authorization.username) {
		return res.status(401).json({ message: "User not logged in" });
	}

	const username = req.session.authorization.username;

	// التحقق من وجود نص المراجعة
	if (!review) {
		return res.status(400).json({ message: "Review content is required" });
	}

	// التحقق من وجود الكتاب
	if (!books[ISBN]) {
		return res.status(404).json({ message: "Book not found" });
	}

	// تهيئة كائن المراجعات إذا لم يكن موجوداً
	if (!books[ISBN].reviews) {
		books[ISBN].reviews = {};
	}

	// إضافة أو تعديل المراجعة
	books[ISBN].reviews[username] = review;

	return res.status(200).json({
		message: "Review successfully added/updated",
		review: books[ISBN].reviews[username]
	});
});

// --- Route: حذف مراجعة كتاب - Task 9 ---
regd_users.delete("/auth/review/:isbn", (req, res) => {
	const ISBN = req.params.isbn;

	// التحقق من وجود الجلسة واسم المستخدم
	if (!req.session || !req.session.authorization || !req.session.authorization.username) {
		return res.status(401).json({ message: "User not logged in" });
	}

	const username = req.session.authorization.username;

	// التحقق من وجود الكتاب
	if (!books[ISBN]) {
		return res.status(404).json({ message: "Book not found" });
	}

	// التحقق من وجود مراجعات للكتاب
	if (!books[ISBN].reviews) {
		return res.status(404).json({ message: "No reviews found for this book" });
	}

	// التحقق مما إذا كان المستخدم قد كتب مراجعة لهذا الكتاب أصلاً
	// هذا يضمن أن المستخدم يحذف مراجعته هو فقط
	if (!books[ISBN].reviews[username]) {
		return res.status(404).json({ message: "Review not found or you are not authorized to delete it" });
	}

	// حذف المراجعة الخاصة بهذا المستخدم فقط
	delete books[ISBN].reviews[username];

	return res.status(200).json({
		message: "Review successfully deleted",
		remaining_reviews: books[ISBN].reviews
	});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;