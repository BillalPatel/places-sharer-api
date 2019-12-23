const express = require('express');

const router = express.Router();

const placesControllers = require('../controllers/places');

router.get('/:pid', placesControllers.getPlacesById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.post('/', placesControllers.createPlace);

router.patch('/:pid', placesControllers.updatePlaceById);

router.delete('/:pid', placesControllers.deletePlaceById);

module.exports = router;
