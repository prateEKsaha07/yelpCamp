const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const mongoose = require('mongoose');
const review = require('../models/review');
const{ cloudinary } = require('../cloudinary');

// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = process.env.MAPBOX_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;


module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    // console.log(campgrounds);
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createNewCamp = async(req,res,next)=>{ 

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    console.log('geodata:',geoData);

    if (!geoData || geoData.features.length === 0) {
        req.flash('error', 'Could not find coordinates for the specified location.');
        return res.redirect('/campground/new');
    }

    // Extract coordinates and store them in the campground object
    const coordinates = geoData.features[0].geometry.coordinates;
    console.log('Coordinates:', coordinates);  // Logging coordinates for verification


    const campground = new Campground(req.body.campground);

    // campground.geometry = geoData.features[0].geometry;
     campground.geometry = {
        type: 'Point',
         coordinates: coordinates // Assign the coordinates from geoData
     };
    

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
    // console.log(camp);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground'); // make sure this matches your index route
    }
    camp.author = camp.author.toString();  // or ._id.toString() if it's populated

    
    // console.log('campground found data:',camp);

    res.render('campgrounds/show',{campground:camp, currentUser: req.user});
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

//need to implement the image thumbnail virtual property in the model to show the image in the edit page
module.exports.saveEditCamp = async(req,res) =>{
    const id = req.params.id;
    console.log(req.body);
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});

    // // removable
    // const geoData = await maptilerClient.geocoding.forward(req.body.camp.location, { limit: 1 });
    // camp.geometry = geoData.features[0].geometry;
    // // removable

    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
      }
    ));
    camp.image.push(...imgs);
    await camp.save();
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    await camp.updateOne({
        $pull:{
            image:{
                filename:{
                    $in:req.body.deleteImages
                }
            }
        }
    })}
    // console.log(camp.image);
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

