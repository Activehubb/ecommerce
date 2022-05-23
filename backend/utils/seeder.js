const Product = require('../models/product');
const dotenv = require('dotenv');
const productData = require('../data/products.json');
const connectDB = require('../config/DBconfig');

dotenv.config({ path: 'backend/config/config.env' });

connectDB();

const seedProductsToDB = async () => {
	try {
		await Product.deleteMany();
		console.log('Product Deleted...');

		await Product.insertMany(productData);

		console.log('Product Seeded...');
	} catch (error) {
		console.log(error.message);
	}
};

seedProductsToDB();
