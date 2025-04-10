const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const campGround = require('./models/campground');
const { title } = require('process');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./Schemas')
const Review = require('./models/review');


const app = express();

//db connection
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//middlewares
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)

//middleware function
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


//securing connections with the database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    console.log('connected to db');
})

//starting the server
app.listen(3000,()=>{
    console.log('server is running on port 3000')
})

// home route
app.get('/',(req,res)=>{
    res.render('home')
})

// testing input route
// app.get('/makeCampground',async (req,res) =>{
//     const camp = new campGround({
//         title: 'My backyard',
//         price: 8347,
//         description:"just a boring place "
//     });
//     await camp.save();
//     res.send(camp)
// })

//index route
app.get('/campground',catchAsync(async(req,res)=>{
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index',{campgrounds})
}))

//create route
app.get('/campground/new',(req,res)=>{
    res.render('campgrounds/new')
})

//getting the data from new camp form 
app.post('/campground', validateCampground ,catchAsync(async(req,res,next)=>{
    const campground = new campGround(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
}));

//show route
app.get('/campground/:id', catchAsync(async(req,res)=>{
    const id = req.params.id;
    const camp = await campGround.findById(id);
    res.render('campgrounds/show',{camp})
}))

//edit route
app.get('/campground/:id/edit', catchAsync(async(req,res)=>{
    const id = req.params.id;
    const camp = await campGround.findById(id);
    res.render('campgrounds/edit',{camp})
    //got the data not to update it to the db we need a package name method-override
}))

app.put('/campground/:id',catchAsync(async(req,res) =>{
    const id = req.params.id;
    const campground = await campGround.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campground/${id}`)
}))

//delete route
app.delete('/campground/:id',catchAsync(async(req,res) =>{
    const id = req.params.id;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campground/');
}));

// review model
app.post('/campground/:id/reviews', catchAsync(async(req,res)=>{
    // res.send("success!")
    const campground = await campGround.findById(req.params.id)
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campground/${campground._id}`)
}))

//generic error for page not found
app.all(/(.*)/,(req,res,next)=>{
    next(new ExpressError('page not found',404))
})

//middleware error handler
app.use((err, req, res, next) =>{
    const { statusCode = 500,message= 'something went wrong'} = err;
    if(!err.message) err.message = 'internal server error';
    res.status(statusCode).render('partials/error',{err})
})



