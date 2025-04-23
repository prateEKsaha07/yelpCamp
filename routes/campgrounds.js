const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const mongoose = require('mongoose');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds')


router.route('/')
.get(catchAsync(campgrounds.index))
.post(validateCampground ,catchAsync(campgrounds.createNewCamp))

router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.route('/:id')
.get(catchAsync(campgrounds.showCamps))
.put(isLoggedIn,isAuthor,catchAsync(campgrounds.saveEditCamp))
.delete(isLoggedIn, isAuthor , catchAsync(campgrounds.deleteCamp))

//edit route
router.get('/:id/edit', isLoggedIn , isAuthor ,catchAsync(campgrounds.editCamp))

module.exports = router;