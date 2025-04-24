const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const review = require('./review');
const User = require('./user');
const { string } = require('joi');

const campgroundSchema = new Schema({
    title: String,      
    image: [
        {   
            url: String,
            filename: String
        }
    ],      
    price: Number,      
    description: String,
    location: String,
    author: {
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    //updating for review model
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

// deleting a campsite along with its all reviews
campgroundSchema.post('findOneAndDelete',async function(doc) {
    if(doc){
        await review.deleteMany({
            _id:{ 
               $in: doc.reviews 
            }
        })
    }
})
//need to understand this above shit later

module.exports = mongoose.model('Campground',campgroundSchema);