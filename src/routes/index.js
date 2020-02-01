require('../models/Game');

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const gameRoutes = require('./gameRoutes');
const mixRoutes = require('./mixRoutes');
const requireAuth = require('../middlewares/requireAuth');

const app = express();
app.use(bodyParser.json());
app.use(gameRoutes);
app.use(mixRoutes);

const mongoUri = 'mongodb+srv://OranoAdmin:oRgspywY8Og76kgf@cluster0-kqsyr.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
})

mongoose.connection.on('error', () => {
    console.log("Can't connect to mongo instance");
})


app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});