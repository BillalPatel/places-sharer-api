const HttpError = require('../models/http-error');
const uuid = require('uuid/v4');

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = dummyPlaces.find((element) => element.id === placeId);

  if (!place) {
    throw new HttpError('Could not find place.', 404);
  }
  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const user = dummyUsers.find((element) => element.id === userId);
  res.json({ user });
};

const createPlace = (req, res, next) => {
  const {
    title, description, address, creator, coordinates
  } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    address,
    creator,
    location: coordinates
  };
  dummyPlaces.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
