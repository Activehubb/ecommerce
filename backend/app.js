const cookieParser = require('cookie-parser');
const express = require('express');
const errorMiddleware = require('./middlewares/errors')

const app = express();

app.use(express.json());
app.use(cookieParser())
// Product Route
app.use('/api/v1', require('./routes/product'));
app.use('/api/v1', require('./routes/user'));

// Error Middleware
app.use(errorMiddleware)

module.exports = app;
