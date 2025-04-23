const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const mongoose = require('mongoose');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds')


//index route
router.get('/',catchAsync(campgrounds.index))

//create route
router.get('/new',isLoggedIn,campgrounds.renderNewForm);

//getting the data from new camp form and posting it to the database
router.post('/', validateCampground ,catchAsync(campgrounds.createNewCamp));

//show route
router.get('/:id', catchAsync(campgrounds.showCamps))

//edit route
router.get('/:id/edit', isLoggedIn , isAuthor ,catchAsync(campgrounds.editCamp))

router.put('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.saveEditCamp))

//delete route
router.delete('/:id',isLoggedIn, isAuthor , catchAsync(campgrounds.deleteCamp));

module.exports = router;