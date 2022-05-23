const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter your name'],
			maxLenght: [30, 'Your name cannot exceed 30 characters'],
		},
		email: {
			type: String,
			required: [true, 'Please enter your email'],
			unique: true,
			validate: [validator.isEmail, 'Please enter valid email'],
		},
		password: {
			type: String,
			required: true,
			minlength: [6, 'Your password must exceed 6 characters'],
			select: false,
		},
		avatar: {
			public_id: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				require: true,
			},
		},
		role: {
			type: String,
			default: 'user',
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
);

// Encrypting password
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcryptjs.genSalt(10)
	this.password = await bcryptjs.hash(this.password, salt);
});

// return JWT token
userSchema.methods.getJwtToken = function () {
	return jsonwebtoken.sign({ id: this._id }, process.env.JWT_TOKEN, {
		expiresIn: process.env.JWT_DURABILITY,
	});
};

userSchema.methods.comparePassword = async function (password) {
	return await bcryptjs.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hash and set to resetPasswordToken
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// Set token expire time

	this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model('User', userSchema);
