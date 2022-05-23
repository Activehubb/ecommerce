const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema(
	{
		user: {
			type: Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		name: {
			type: String,
			required: [true, 'Please enter product name'],
			trim: true,
			maxlength: [150, 'Product name can not exceed 100 chars'],
		},
		price: {
			type: String,
			required: [true, 'Please enter product price'],
			maxlength: [8, 'Product price can not exceed 5 chars'],
			default: 0.0,
		},
		description: {
			type: String,
			required: [true, 'Please enter product desc'],
		},
		ratings: {
			type: Number,
			default: 0,
		},
		images: [
			{
				public_id: {
					type: String,
					require: true,
				},
				url: {
					type: String,
					require: true,
				},
			},
		],
		category: {
			type: String,
			required: [true, 'Please enter product category '],
			enum: {
				values: [
					'Electronics',
					'Cameras',
					'Laptop',
					'Accessories',
					'Headphones',
					'Food',
					'Book',
					'Clothes/Shoes',
					'Beauty/Health',
					'Sports',
					'Outdoor',
					'Home',
				],
				message: 'Please select correct category for product',
			},
		},
		seller: {
			type: String,
			required: [true, 'Please enter seller details'],
		},
		stock: {
			type: Number,
			required: [true, 'Please enter product stock'],
			maxLength: [5, 'Product stock cannot exceed 5 character'],
		},
		numOfReviews: {
			type: Number,
			default: 0,
		},
		review: [
			{
				uname: {
					type: String,
					required: true,
				},
				comment: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
