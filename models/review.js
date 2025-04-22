const mongoose = require('mongoose');
const { Schema } = mongoose;


const reviewSchema = new Schema({
    body:String,
    rating:Number,
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
});


//one to many relationship

module.exports = mongoose.model('Review', reviewSchema);