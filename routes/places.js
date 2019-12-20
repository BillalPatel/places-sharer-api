const express = require('express');
const HttpError = require('../models/http-error');

const router = express.Router();

const dummyPlaces = [
  {
    id: '123',
    title: 'Istanbul',
    description: 'Hagia Sophia',
    address: 'Sultan Ahmet, Ayasofya Meydanı, 34122 Fatih/İstanbul, Turkey',
    imageUrl: 'http://i.hurimg.com/i/hdn/75/0x0/5c0d246dc03c0e15a49c546a.jpg',
    creatorId: 'user1',
    location: {
      lat: 41.008583,
      lng: 28.9779863
    }
  },
  {
    id: '1321',
    title: 'Paris',
    description: 'Eiffel Tower',
    address: 'Sultan Ahmet, Ayasofya Meydanı, 34122 Fatih/İstanbul, Turkey',
    imageUrl: 'http://i.hurimg.com/i/hdn/75/0x0/5c0d246dc03c0e15a49c546a.jpg',
    creatorId: 'user1',
    location: {
      lat: 41.008583,
      lng: 28.9779863
    }
  }
];

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;
  const user = dummyPlaces.find((element) => element.creatorId === userId);

  if (!user) {
    return next(new HttpError('Could not find place with this user ID.', 400));
  }
  res.json({ user });
});

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid;
  const place = dummyPlaces.find((element) => element.id === placeId);

  if (!place) {
    throw new HttpError('Could not find searched place.', 404);
  }
  res.json({ place });
});

module.exports = router;
