const express = require('express');
const bodyParser = require('body-parser')
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express();

// Modules
const routes = require('./routes');

require('dotenv').config()

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

// Mongo Database connection
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('We are connected to the database');

    // app.get('/', (req, res) => {
    //     const user = new User({ username: 'rohit', password: 'jgjgj' });
    //     user.save((err, data) => {
    //         if (err) return res.send('false');
    //         res.send(data);
    //     })
    // })

    app.use('/api', routes);
});


app.listen(process.env.NODE_PORT, () => {
    console.log('server started on ' + process.env.NODE_PORT);
})