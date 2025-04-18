const Joi = require('joi');

// Define the schema for the request body
module.exports.campgroundSchema = Joi.object({
    campground:Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

// to prevent empty review submission in server side
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})