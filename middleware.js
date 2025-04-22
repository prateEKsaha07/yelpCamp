const {campgroundSchema, reviewSchema} =require('./Schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');


module.exports.isLoggedIn = (req,res,next) =>{
    // console.log('REQ.USER...',req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','you must be logged in');
        return res.redirect('/login');
    }
    next();
}

//middleware function for new campground server side validation
module.exports.validateCampground = (req,res,next) =>{
    // if(!req.body.campground) throw new ExpressError('invalid campground id', 400);
   const {error} = campgroundSchema.validate(req.body)
   if(error){
       const msg = error.details.map(el => el.message).join(',')
       throw new ExpressError(msg,400);
   }else{
       next();
   }
}

module.exports.isAuthor = async(req,res,next) =>{
   const { id } = req.params; 
   const camp = await Campground.findById(id);
   if(!camp.author.equals(req.user._id)){
       req.flash('error', 'You do not have permission to edit this campground!'); 
       return res.redirect(`/campground/${id}`);
   }
   next();
}
// for reviews validation
module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400);
        }else{
            next();
        }
    }
