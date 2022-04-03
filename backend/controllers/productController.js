exports.getProducts = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: 'Routes for all products in DB',
	});
};
