const express = require('express');
const router = express.Router();

const {
	newProduct,
	getProducts,
	getProductById,
	updateProductById,
	deleteProductById,
} = require('../controllers/productController');
const { Auth, AuthorizedRole } = require('../middlewares/auth');

router.route('/admin/product/create').post(Auth, newProduct);
router.route('/products').get(getProducts);
router.route('/product/:id').get(getProductById);
router
	.route('/admin/product/:id')
	.put(Auth, AuthorizedRole('admin'), updateProductById);
router
	.route('/admin/product/:id')
	.delete(Auth, AuthorizedRole('admin'), deleteProductById);

module.exports = router;
