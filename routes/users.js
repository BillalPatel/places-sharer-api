const express = require('express');

const router = express.Router();

const usersControllers = require('../controllers/users');

router.get('/:pid', usersControllers.getPlacesById);

router.post('/signup', usersControllers.createPlace);

router.post('/login', usersControllers.createPlace);

module.exports router;
