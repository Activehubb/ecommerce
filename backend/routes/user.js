const express = require('express');
const Router = express.Router();
const { Auth, AuthorizedRole } = require('../middlewares/auth');
const {
	signupUser,
	signinUser,
	logout,
	forgotPassword,
	resetPassword,
	getUser,
	updateUserPassword,
	updateProfile,
	getAllUsers,
	getUserDetailsById,
	updateUser,
	deleteUserProfile,
} = require('../controllers/userController');

Router.route('/signup').post(signupUser);
Router.route('/signin').post(signinUser);
Router.route('/user').get(Auth, getUser);
Router.route('/user/update').put(Auth, updateProfile);

// Admin Permission

Router.route('/admin/users').get(Auth, AuthorizedRole('admin'), getAllUsers);

Router.route('/admin/user/:id').get(
	Auth,
	AuthorizedRole('admin'),
	getUserDetailsById
);

Router.route('/admin/user/:id').put(Auth, AuthorizedRole('admin'), updateUser);

Router.route('/admin/user/:id').delete(
	Auth,
	AuthorizedRole('admin'),
	deleteUserProfile
);

// Admin Permission
Router.route('/password').put(Auth, updateUserPassword);
Router.route('/password/forgot').post(forgotPassword);
Router.route('/password/reset/:token').put(resetPassword);
Router.route('/logout').get(logout);

module.exports = Router;
