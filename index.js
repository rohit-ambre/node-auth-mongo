const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const winston = require('winston');

const app = express();
// Modules
const routes = require('./routes');

require('dotenv').config();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

/**
 * Winston logger formatter
 * @returns formatted log string
 */
const myFormat = winston.format.printf(({ level, message, timestamp }) => {
    const date = new Date(timestamp);
    timestamp = date.toGMTString();
    return `[${timestamp}] - ${level}: ${message}`;
});

// Winston logger configuraiton
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        myFormat
    ),
    defaultMeta: { service: 'user-service' },
    exitOnError: false,
    transports: [
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 1024 * 1024 * 10, // 10MB
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 1024 * 1024 * 10, // 10MB
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
        }),
    ],
});
logger.stream = {
    write: (message, encoding) => {
        logger.verbose(message);
    },
};

if (process.env.NODE_ENV !== 'production') {
    // app.use(morgan('dev'));
    app.use(
        morgan('dev', {
            stream: logger.stream,
            // only log error responses
            // skip: (req, res) => {
            //     return res.statusCode < 400;
            // },
        })
    );
}

// Mongo Database connection
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    logger.error('We are connected to the database');

    app.use('/api', routes);
});

app.listen(process.env.NODE_PORT, () => {
    logger.info(`server started on port ${process.env.NODE_PORT}`);
});
