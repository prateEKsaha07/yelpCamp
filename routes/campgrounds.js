const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const mongoose = require('mongoose');
const {isLoggedIn,isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');


const{ storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });



router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createNewCamp))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.files); // ✅ this will show the array of uploaded images
//     res.send('Images uploaded successfully!');
// });

router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.route('/:id')
.get(catchAsync(campgrounds.showCamps))
.put(isLoggedIn,isAuthor,catchAsync(campgrounds.saveEditCamp))
.delete(isLoggedIn, isAuthor , catchAsync(campgrounds.deleteCamp))

//edit route
router.get('/:id/edit', isLoggedIn , isAuthor ,catchAsync(campgrounds.editCamp))

module.exports = router;