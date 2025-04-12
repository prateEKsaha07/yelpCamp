const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
// routes
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews');
const { Session } = require('inspector/promises');


const app = express();

//db connection
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
});

//middlewares
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,'public')));
const sessionConfig ={
    secret:'hellohowareyou!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true, // this is default these days but can do it
        expires: Date.now() + 86400000 * 7, // one day = 86400000 ms
        maxAge:86400000 * 7 ,
    }
}
app.use(session(sessionConfig));

// home route
app.get('/',(req,res)=>{
    res.render('home')
})

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


app.use('/campground', campgrounds );
app.use('/campground/:id/reviews', reviews);


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



