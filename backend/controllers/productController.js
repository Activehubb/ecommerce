const Product = require('../models/product');
const { APIFeatures } = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');

//  Create New Peoduct  => /api/v1/product/new
exports.newProduct = async (req, res, next) => {
	try {

		req.body.user = req.user.id
		const product = await Product.create(req.body);

		res.status(201).json({ success: true, product });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: `server ERR`,
			err: error.message,
		});
	}
};

// GET ALL PRODUCTS => /api/v1/products

exports.getProducts = async (req, res, next) => {
	try {

		const resPerPage = 4

		const productCounts = await Product.countDocuments()
		const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().pagination(resPerPage);

		const fetchAllProducts = await apiFeatures.query;
		res.status(200).json({
			success: true,
			counts: fetchAllProducts.length,
			productCounts,
			fetchAllProducts,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: `server ERR`,
			err: error.message,
		});
	}
};

// GET products by ID => /api/v1/products/:productID
exports.getProductById = async (req, res, next) => {
	try {
		const getProductById = await Product.findById(req.params.id);
		!getProductById
			? next(new ErrorHandler('Product not found...', 404))
			: res.status(200).json({ success: true, getProductById });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ msg: `ERR: ${error.message}` });
	}
};

// UPDATE products by ID => /api/v1/product/admin/:productID
exports.updateProductById = async (req, res, next) => {
	try {
		const updateProductById = await Product.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);
		!updateProductById
			? res.status(404).json({ success: false, msg: 'Product not found...' })
			: res.status(201).json({ success: true, updateProductById });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ msg: `ERR: ${error.message}` });
	}
};

// DELETE product by ID => /api/v1/product/admin/:productID
exports.deleteProductById = async (req, res, next) => {
	try {
		const deleteProductById = await Product.findByIdAndDelete(req.params.id);
		!deleteProductById
			? res.status(404).json({ success: false, msg: 'Product not found...' })
			: res.status(200).json({ success: true, msg: 'Product Deleted...' });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ msg: `ERR: ${error.message}` });
	}
};
