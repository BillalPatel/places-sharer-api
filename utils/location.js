const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyCc6DxLo3qUFNjQX5fFB1ntrWoOO9YED9o';

const getAddressCoordinate = async (address) => {
  const mapsResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=
    ${encodeURIComponent(address)}
    &key=${API_KEY}`);

  if (!mapsResponse.data || mapsResponse.data.status === 'ZERO_RESULTS') {
    throw new HttpError('Could not find location for this address', 422);
  } else {
    const coordinates = mapsResponse.data.results[0].geometry.location;
    return coordinates;
  }
};

module.exports = getAddressCoordinate;
