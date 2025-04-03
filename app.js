const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const campGround = require('./models/campground');
const { title } = require('process');

const app = express();

//db connection
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//middlewares
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

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

// new route
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
app.get('/campground',async (req,res)=>{
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index',{campgrounds})
})

//show route
app.get('/campground/:id', async (req,res)=>{
    const id = req.params.id;
    const camp = await campGround.findById(id);
    res.render('campgrounds/show',{camp})
})

