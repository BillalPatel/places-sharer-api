const express = require('express');
const bodyParser = require('body-parser');

const places = require('./routes/places');
const users = require('./routes/users');

const app = express();

app.use('/api/places', places);
app.use('/api/users', users);

app.listen(5000);
