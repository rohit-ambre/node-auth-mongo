const express = require('express');
const bodyParser = require('body-parser')
const helmet = require('helmet');
const mongoose = require('mongoose');
const logger = require('morgan')
const app = express();
// Modules
const routes = require('./routes');

require('dotenv').config()

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
    app.use(logger('dev'));
}

// Mongo Database connection
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('We are connected to the database');

    app.use('/api', routes);
});


app.listen(process.env.NODE_PORT, () => {
    console.log('server started on ' + process.env.NODE_PORT);
})