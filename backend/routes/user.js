const express = require('express');
const Router = express.Router();
const {
	signupUser,
	signinUser,
	logout,
	forgotPassword,
	resetPassword,
} = require('../controllers/userController');

Router.route('/signup').post(signupUser);
Router.route('/signin').post(signinUser);
Router.route('/password/forgot').post(forgotPassword);
Router.route('/password/reset/:token').put(resetPassword);
Router.route('/logout').get(logout);

module.exports = Router;
