const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');

const places = require('./routes/places');
const users = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use('/api/places', places);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).json({
    errorMessage: error.message || 'Error occurred.'
  });
});

app.use('/api/users', users);

app.listen(5000);
