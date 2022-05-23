// Check for Authorization

const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');

exports.Auth = async (req, res, next) => {
	try {
		const { token } = req.cookies;

		if (!token) {
			return next(
				new ErrorHandler(`You are not Authorized, Please Signin`, 401)
			);
		}

		const decoded = jsonwebtoken.verify(token, process.env.JWT_TOKEN);

		req.user = await User.findById(decoded.id);

		next();
	} catch (error) {
		res.status(500).json({ msg: `Auth Err: ${error.message}` });
	}
};

exports.AuthorizedRole = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorHandler(
					`${req.user.role} is not allowed to access this route`
				)
			);
		}

		next();
	};
};
