const mongoose = require('mongoose');
const logger = require('../utils/logger');

const URI = process.env.MONGO_URI;

mongoose.connect(URI)
    .then( () => {
        logger.info("Database conntected");
    })
    .catch( (error) => {
        logger.error(error);
    })