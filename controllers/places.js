const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getAddressCoordinate = require('../utils/location');
const Place = require('../models/place-mongoose');
const User = require('../models/user-mongoose');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError('Error occurred', 500));
  }

  if (!place) {
    return next(new HttpError('Could not find place', 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (error) {
    return next(new HttpError('Error occurred', 500));
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError('Could not find any places', 404));
  }

  res.json({ places: userWithPlaces.places.map((place) => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input submitted', 422));
  }

  const {
    title, description, address, creatorId
  } = req.body;

  let coordinates;

  try {
    coordinates = await getAddressCoordinate(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place ({
    creatorId,
    title,
    description,
    address,
    imageUrl: req.file.path,
    location: coordinates
  });

  let user;

  try {
    user = await User.findById(creatorId);
  } catch (error) {
    if (!user) {
      return next(new HttpError('Could not find this user', 404));
    }
    if (!user) {
      return next(new HttpError('Could not find this user', 404));
    }
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError('Could not create the new place', 500));
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input submitted', 422));
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError('Could not update this place', 500));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(new HttpError('Could not update this place'));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate('creatorId');
  } catch (error) {
    return next(new HttpError('Could not delete this place', 500));
  }

  if (!place) {
    return next(new HttpError('Could not find this place', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creatorId.places.pull(place);
    await place.creatorId.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError('Could not delete this place', 500));
  }
  res.status(200).json({ message: 'Place deleted' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
