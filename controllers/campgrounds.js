const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const mongoose = require('mongoose');
const review = require('../models/review');


module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    // console.log(campgrounds);
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createNewCamp = async(req,res,next)=>{
    console.log(req.files);
    console.log(req.body);

    const campground = new Campground(req.body.campground);
    campground.image = req.files.map(f => ({
        url: f.path,
        filename: f.filename
      }));
      
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','new campground created successfully!')
    res.redirect(`/campground/${campground._id}`);
}

module.exports.showCamps = async(req,res)=>{
    const id = req.params.id;

    // Check if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid campground ID!');
        return res.redirect('/campground');
    }


    const camp = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    console.log(camp);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground'); // make sure this matches your index route
    }
    camp.author = camp.author.toString();  // or ._id.toString() if it's populated

    //debugging
    console.log(review.author)
    console.log('Camp Author:', camp.author);
    console.log('Current User:', req.user ? req.user._id : 'No user');

    res.render('campgrounds/show',{camp, currentUser: req.user});
    // populating with reviews
}

module.exports.editCamp = async(req,res)=>{

    const id = req.params.id;
    const camp = await Campground.findById(id);

    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground');
    }
    res.render('campgrounds/edit',{camp})
    //got the data not to update it to the db we need a package name method-override
}

module.exports.saveEditCamp = async(req,res) =>{
    const id = req.params.id;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
      }));
    camp.image.push(...imgs);
    await camp.save();
    console.log('campground updated:', id)
    req.flash('success','campground updated successfully!')
    res.redirect(`/campground/${camp._id}`)
}

module.exports.deleteCamp = async(req,res) =>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    console.log('campground deleted:', id)
    req.flash('success','campground deleted successfully!')
    res.redirect('/campground');
}

