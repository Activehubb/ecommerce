const app = require('./backend/app');
const dotenv = require('dotenv');
dotenv.config({ path: 'backend/config/config.env' });

const PORT = process.env.PORT;
const MODE = process.env.NODE_ENV;

app.listen(PORT, () => console.log(` running on port ${PORT} in ${MODE} mode`));
