const app = require('./backend/app');
const dotenv = require('dotenv');
const connectDB = require('./backend/config/DBconfig');
dotenv.config({ path: 'backend/config/config.env' });

const PORT = process.env.PORT;
const MODE = process.env.NODE_ENV;

// Handle uncaught exception

process.on('uncaughtException', (error) => {
	console.log(`ERR: ${error.message}`);
	console.log(`Shutting down the server due to uncaughtException`);
	process.exit(1);
});

// Connect to DB
connectDB();

const server = app.listen(PORT, () =>
	console.log(`Server running on port ${PORT} in ${MODE} mode`)
);

// Handle unhandle promise rejection
process.on('unhandledRejection', (error) => {
	console.log(`ERR: ${error.message}`);
	console.log(`Shutting down the server due to unhandled promise rejection`);
	server.close(() => {
		process.exit(1);
	});
});
