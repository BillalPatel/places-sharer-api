const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const dummyUsers = [
  {
    id: '90',
    name: 'Bill',
    email: '1@.com',
    password: 'abc'
  }
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: dummyUsers });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid input submitted', 422);
  }

  const { name, email, password } = req.body;
  const userExists = dummyUsers.find((element) => element.email === email);

  if (userExists) {
    throw new HttpError('User email already exists. Try logging in instead', 401);
  }

  const createdUser = {
    id: uuid(),
    name,
    password
  };
  dummyUsers.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const foundUser = dummyUsers.find((element) => element.email === email);

  if (!foundUser || !foundUser.password === password) {
    throw new HttpError('Could not find user', 422);
  } else {
    res.status(200).json({ meessage: 'Logged in successfully' });
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
