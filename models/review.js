const mongoose = require('mongoose');
const { Schema } = mongoose;


const reviewSchema = new Schema({
    body:String,
    rating:Number,
});


//one to many relationship

module.exports = mongoose.model('Review', reviewSchema);