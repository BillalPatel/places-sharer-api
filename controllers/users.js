const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user-mongoose');
const HttpError = require('../models/http-error');

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, 'name imageUrl email');
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

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    return next(new HttpError('Could not create the new user', 500));
  }

  const createdUser = new User({
    name,
    imageUrl: req.file.path,
    email,
    hashedPassword,
    places: []
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError('Could not create the new user', 500));
  }

  let token;

  try {
    token = jwt.sign({
      userId: createdUser.id,
      email: createdUser.email
    },
    'secret',
    { expiresIn: '2h' });
  } catch (error) {
    return next(new HttpError('Could not create the new user', 500));
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    password: createdUser.password
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Error occurred when logging in', 500));
  }

  if (!existingUser) {
    return next(new HttpError('Invalid user credentials entered. Please try again', 401));
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError('Could not access user details', 500));
  }

  if (!isValidPassword) {
    return next(new HttpError('Invalid user credentials entered. Please try again', 401));
  }

  let token;

  try {
    token = jwt.sign({
      userId: existingUser.id,
      email: existingUser.email
    },
    'secret',
    { expiresIn: '2h' });
  } catch (error) {
    return next(new HttpError('Could not login', 500));
  }

  res.status(200).json({
    user: existingUser.id,
    email: existingUser.email,
    token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
