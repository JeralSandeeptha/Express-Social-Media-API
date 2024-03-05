const pino = require('pino');

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: `yyyy-mm-dd HH:mm:ss`,
            ignore: "pid"
        }
    }
});

module.exports = logger;