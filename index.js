const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

// Modules
const logger = require('./winston-config');
const routes = require('./routes');

require('dotenv').config();

// create express app
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

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
    logger.info('We are connected to the database');

    app.use('/api', routes);

    app.use('/', (req, res) => {
        res.send('<h3 style="text-align:center">This is a Boilerplate Express application with authentication with mongo Database</h3>');
    })
  
    app.use('*', (req, res) => {
        res.sendFile(path.join(__dirname, '/not_found.html'));
    })
});

app.listen(process.env.NODE_PORT, () => {
    logger.info(`server started on port ${process.env.NODE_PORT}`);
});
