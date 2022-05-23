const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(
			process.env.DB_LOCAL_URI,
			console.log('mongoDB connected')
		);
	} catch (err) {
		console.log(`DB: ${err}`);
	}
};

module.exports = connectDB;
