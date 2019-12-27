const mongoose = require('mongoose');

const { Schema } = mongoose;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, minlength: 5, required: true },
  address: { type: String, required: true },
  imageUrl: { type: String, required: true },
  creatorId: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Place', placeSchema);
