const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const User = require('../models/user-mongoose');
const HttpError = require('../models/http-error');

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, 'email name');
  } catch (error) {
    return next(new HttpError('Could not get users', 500));
  }

  res.status(200).json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input submitted. Try submitting something else', 422));
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Error occurred when signing up', 500));
  }

  if (existingUser) {
    return next(new HttpError('User already exists. Try logging in instead', 422));
  }

  const createdUser = new User ({
    id: uuid(),
    name,
    email,
    password,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/London-Eye-2009.JPG',
    places: []
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError('Could not create the new user', 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Error occurred when logging in', 500));
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError('Invalid user credentials entered. Please try again', 401));
  }

  res.status(200).json({ message: 'Logged in successfully', users: existingUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
