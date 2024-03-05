require('./config/env-config');
require('./config/db-config');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const adminRoutes = require('./api/routes/adminRoutes');

const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json({ limit: '100mb' }));

app.use('/api/v1/admins', adminRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    logger.info(`Server is running at ${port}`);
    console.log(`Server is running at ${port}`);
});