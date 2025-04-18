const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const mongoose = require('mongoose');
const { reviewSchema } = require('../Schemas')
const Review = require('../models/review')

//middleware function for new review server side validation
const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400);
        }else{
            next();
        }
    }

// review model
router.post('/', validateReview,catchAsync(async(req,res)=>{
    // res.send("success!")
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Review added successfully')
    res.redirect(`/campground/${campground._id}`)
}))

//delete review
router.delete('/:reviewId', catchAsync(async(req,res)=>{
    const{id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted successfully')
    res.redirect(`/campground/${id}`)
}))

module.exports = router;