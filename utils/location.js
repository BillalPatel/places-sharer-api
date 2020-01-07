const axios = require('axios');
const HttpError = require('../models/http-error');
const API_KEY = require('./location-api');

const googleMapsKey = API_KEY.API_KEY;

const getAddressCoordinate = async (address) => {
  const mapsResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=
    ${encodeURIComponent(address)}
    &key=${googleMapsKey}`);

  if (!mapsResponse.data || mapsResponse.data.status === 'ZERO_RESULTS') {
    throw new HttpError('Could not find location for this address', 422);
  } else {
    const coordinates = mapsResponse.data.results[0].geometry.location;
    return coordinates;
  }
};

module.exports = getAddressCoordinate;
