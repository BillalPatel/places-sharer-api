const express = require('express');
const bodyParser = require('body-parser');

const places = require('./routes/places');
const users = require('./routes/users');

const app = express();

app.use('/api/places', places);
app.use('/api/users', users);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).json({
    errorMessage: error.message || 'Error occurred.'
  });
});

app.listen(5000);
