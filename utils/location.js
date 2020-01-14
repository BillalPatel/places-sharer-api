const axios = require('axios');
const HttpError = require('../models/http-error');

const getAddressCoordinate = async (address) => {
  return {
    lat: 40.7484474,
    lng: -73.9871516
  };
  
  const mapsResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=
    ${encodeURIComponent(address)}
    &key=${process.env.GOOGLE_API_KEY}`);

  if (!mapsResponse.data || mapsResponse.data.status === 'ZERO_RESULTS') {
    throw new HttpError('Could not find location for this address', 422);
  } else {
    const coordinates = mapsResponse.data.results[0].geometry.location;
    return coordinates;
  }
};

module.exports = getAddressCoordinate;
