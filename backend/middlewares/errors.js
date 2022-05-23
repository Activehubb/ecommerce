const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || 'Internal server error';

	if (process.env.NODE_ENV === 'DEVELOPMENT') {
		res.status(err.statusCode).json({
			success: false,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}

	if (process.env.NODE_ENV === 'PRODUCTION') {
		let error = { ...err };

		error.message = err.message;

		res.status(error.statusCode).json({
			success: false,
			message: error.message || 'Internal Server ERR',
		});
	}

	if (err.code === 11000) {
		const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
		error = new ErrorHandler(message, 400);
	}

	// Handle wrong JWT error
	if (err.name === 'JsonWebTokenError') {
		const message = `Token is Invalid, Try Again`;

		error = new ErrorHandler(message, 400);
	}

	if (err.name === 'TokenExpiredError') {
		const message = 'Token has expired, Try Again';

		error = new ErrorHandler(message, 400);
	}
};
