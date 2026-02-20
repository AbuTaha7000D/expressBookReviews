const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

// تم تعديل إعدادات الجلسة لإضافة cookie options
app.use("/customer", session({
	secret: "fingerprint_customer",
	resave: true,
	saveUninitialized: true,
	cookie: {
		secure: false,      // ضروري جداً للعمل على http://localhost
		httpOnly: false,    // يسمح لـ cURL بقراءة الكوكيز (لأغراض الاختبار)
		maxAge: 3600000     // مدة الجلسة ساعة واحدة
	}
}));

app.use("/customer/auth/*", function auth(req, res, next) {
	if (req.session && req.session.authorization) {
		return next();
	} else {
		return res.status(403).json({ message: "User not logged in" });
	}
});

const PORT = 5000;

// ربط المسارات
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
