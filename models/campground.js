const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const review = require('./review');
const User = require('./user');
const { string } = require('joi');


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,      
    image: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },      
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
    ],
});

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campground/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

// Ensure the virtual is included in the JSON response
campgroundSchema.set('toJSON', {
    virtuals: true
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