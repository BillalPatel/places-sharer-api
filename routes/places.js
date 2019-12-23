const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const placesControllers = require('../controllers/places');

router.get('/:pid', placesControllers.getPlacesById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.post('/',
  check('title').not().isEmpty(),
  check('description').isLength({ min: 5 }),
  check('address').not().isEmpty(),
  placesControllers.createPlace);

router.patch('/:pid', placesControllers.updatePlaceById);

router.delete('/:pid', placesControllers.deletePlaceById);

module.exports = router;
