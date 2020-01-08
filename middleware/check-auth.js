const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new HttpError('Authentication failed for this user', 401));
    }
    const decodedToken = jwt.verify(token, 'super');
    req.userData = { userData: decodedToken.userId };
    next();
  } catch (error) {
    return next(new HttpError('Authentication failed', 401));
  }
};
