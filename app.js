if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const { Session } = require('inspector/promises');

// routes
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');



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

app.use(flash());




app.use(passport.initialize())
app.use(passport.session()); // for persistence login session
passport.use(new LocalStrategy(User.authenticate()))

// this basically storing and de-storing in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//temp res-working
// app.get('/fakeUser',async(req,res) =>{
//     const user = new User({
//         username:'test',
//         email:'test',
//     })
//     const result = await User.register(user,'test123');
//     res.send(result);
// })



app.use((req,res,next)=>{
    // console.log(req.session)
    res.locals.currentUser = req.user; // this is the logged-in user
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})





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
});

app.use('/',userRoutes)
app.use('/campground', campgroundRoutes );
app.use('/campground/:id/reviews', reviewRoutes);


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
//todo:
// that flash alert is not properly responding needed to be fixed 



