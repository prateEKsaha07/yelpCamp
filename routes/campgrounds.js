const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const mongoose = require('mongoose');
const { campgroundSchema } = require('../Schemas');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');


//index route
router.get('/',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    // console.log(campgrounds);
    res.render('campgrounds/index',{campgrounds})
}))

//create route
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new')
});

//getting the data from new camp form 
router.post('/', validateCampground ,catchAsync(async(req,res,next)=>{
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','new campground created successfully!')
    res.redirect(`/campground/${campground._id}`);
}));

//show route
router.get('/:id', catchAsync(async(req,res)=>{
    const id = req.params.id;

    // Check if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid campground ID!');
        return res.redirect('/campground');
    }


    const camp = await Campground.findById(id).populate('reviews').populate('author');
    console.log(camp);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground'); // make sure this matches your index route
    }
    camp.author = camp.author.toString();  // or ._id.toString() if it's populated


    res.render('campgrounds/show',{camp, currentUser: req.user});
    // populating with reviews

    //debugging
    console.log('Camp Author:', camp.author);
    console.log('Current User:', req.user ? req.user._id : 'No user');

}))

//edit route
router.get('/:id/edit', isLoggedIn , isAuthor ,catchAsync(async(req,res)=>{

    const id = req.params.id;
    const camp = await Campground.findById(id);

    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground');
    }
    res.render('campgrounds/edit',{camp})
    //got the data not to update it to the db we need a package name method-override
}))

router.put('/:id',isLoggedIn,isAuthor,catchAsync(async(req,res) =>{
    const id = req.params.id;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','campground updated successfully!')
    res.redirect(`/campground/${camp._id}`)
}))

//delete route
router.delete('/:id',isLoggedIn, isAuthor , catchAsync(async(req,res) =>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    console.log('campground deleted:', id)
    req.flash('success','campground deleted successfully!')
    res.redirect('/campground');
}));
module.exports = router;