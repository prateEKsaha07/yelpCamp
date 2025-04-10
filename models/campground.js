const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,      
    image: String,      
    price: Number,      
    description: String,
    location: String,
    //updating for review model
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

module.exports = mongoose.model('Campground',campgroundSchema);