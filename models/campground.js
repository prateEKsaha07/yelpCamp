const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,       // Correct type
    image: String,       // Correct type
    price: Number,       // Correct type
    description: String, // Correct type
    location: String     // Correct type
});

module.exports = mongoose.model('Campground',campgroundSchema);