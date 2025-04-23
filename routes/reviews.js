const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const mongoose = require('mongoose');
// const { reviewSchema } = require('../Schemas')
const { validateReview, isLoggedIn, isAuthor , isReviewAuthor} = require('../middleware');

const reviews = require('../controllers/reviews')



// review model
router.post('/', validateReview , isLoggedIn ,catchAsync(reviews.createReview))

//delete review
router.delete('/:reviewId', isLoggedIn , isReviewAuthor , catchAsync(reviews.deleteReview))

module.exports = router;