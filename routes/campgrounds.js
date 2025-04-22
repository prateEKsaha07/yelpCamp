const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const mongoose = require('mongoose');
const { campgroundSchema } = require('../Schemas');
const {isLoggedIn} = require('../middleware');


//middleware function for new campground server side validation
const validateCampground = (req,res,next) =>{
     // if(!req.body.campground) throw new ExpressError('invalid campground id', 400);
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

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
router.get('/:id/edit',isLoggedIn, catchAsync(async(req,res)=>{
    
    const id = req.params.id;
    const camp = await Campground.findById(id);

    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground');
    }

    if(!camp.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this campground!'); 
        return res.redirect(`/campground/${id}`);
    }
    
    res.render('campgrounds/edit',{camp})
    //got the data not to update it to the db we need a package name method-override
}))

router.put('/:id',isLoggedIn,catchAsync(async(req,res) =>{
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this campground!'); 
        return res.redirect(`/campground/${id}`);
    }
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','campground updated successfully!')
    res.redirect(`/campground/${id}`)
}))

//delete route
router.delete('/:id',isLoggedIn, catchAsync(async(req,res) =>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    console.log('campground deleted:', id)
    req.flash('success','campground deleted successfully!')
    res.redirect('/campground');
}));
module.exports = router;