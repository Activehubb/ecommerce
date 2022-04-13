const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_LOCAL_URI, (con) =>
			console.log(`mongoDB connected with HOST: ${con.connection.host}`)
		);
	} catch (err) {
		console.error(`DB ERR: ${err}`);
	}
};

module.exports = connectDB;
