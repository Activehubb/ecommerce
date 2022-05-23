const catchAsyncErr = require('../middlewares/catchAsyncErr');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const { sendToken } = require('../utils/setToken');
const crypto = require('crypto');

// Register User => /api/v1/user/

exports.signupUser = async (req, res, next) => {
	try {
		let user = await User.findOne({ email: req.body.email });

		if (user) {
			return next(new ErrorHandler(`${req.body.email} already exist`));
		} else {
			user = await User.create(req.body);

			sendToken(user, 200, res);
		}
	} catch (error) {
		res.status(500).send(`Server ERR: ${error.message}`);
		console.log(error.message);
	}
};

// SIGNIN USER

exports.signinUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return next(new ErrorHandler('Please enter email and password', 400));
		}

		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			return next(new ErrorHandler(`Invalid Credentials`, 401));
		}

		const isPasswordMatched = await user.comparePassword(password);

		if (!isPasswordMatched) {
			return next(new ErrorHandler(`Invalid Credentials`, 401));
		}

		sendToken(user, 200, res);
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: `Server ERR: ${error.message}`,
		});
		console.log(`Server ERR: ${error.message}`);
	}
};

// GET USER PROFILE

exports.getUser = catchAsyncErr(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({ success: true, user });
});

// forgot password => /api/v1/password/reset

exports.forgotPassword = catchAsyncErr(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	// Check and verify user Email in the DB

	if (!user) {
		return next(new ErrorHandler(`${req.body.email} do not exist`, 404));
	}

	// if user then get and send resetToken

	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	// Create a reset password url

	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/password/reset/${resetToken}`;

	const message = `${user.name}, Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email ignore it.`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Your Ecommerce Password Recovery',
			message,
		});

		res
			.status(200)
			.json({ success: true, msg: `Email has been sent to ${user.email}` });
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorHandler(`server Err: ${error.message}`), 500);
	}
});

// RESET PASSWORD

exports.resetPassword = catchAsyncErr(async (req, res, next) => {
	// Hash and compare url token to the database
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(new ErrorHandler(`Password Token is Invalid`, 400));
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new ErrorHandler(`Password does not match`, 400));
	}

	// setup the new Password
	user.password = req.body.password;

	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	sendToken(user, 200, res);
});

// LOGOUT
exports.logout = async (req, res, next) => {
	try {
		res.cookie('token', null, {
			expires: new Date(Date.now()),
			httpOnly: true,
		});

		res.status(200).json('Logout successfully...');
	} catch (error) {
		res.status(500).json({ msg: `logout ERR: ${error.message}` });
	}
};
