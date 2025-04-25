const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const{ places , descriptors } = require('./seedHelpers')

//db connection
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    console.log('connected to db');
})


//picking a random number from an array
// array[Math.floor(Math.random()*array.length)]

const sample = (array) => {
    return array[Math.floor(Math.random()*array.length)]
}


const seedDB = async() =>{
    await Campground.deleteMany({});
    
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            author:'6803038e01f5d4afe7940d79',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            image:[
                {
                  url: 'https://res.cloudinary.com/dhsf8mub9/image/upload/v1745592032/YelpCamp/yrmumodgjbxgty6bdprr.jpg',
                  filename: 'YelpCamp/yrmumodgjbxgty6bdprr',
                },
                {
                  url: 'https://res.cloudinary.com/dhsf8mub9/image/upload/v1745592035/YelpCamp/bsmpnxzmwfwbwe6slxhp.jpg',
                  filename: 'YelpCamp/bsmpnxzmwfwbwe6slxhp',
                }
            ],
            description: 'loremad adad fafef aefrfsjfs akdfehafb afuehka oahuhka iuhckehck uhckhk cahzhue uchsgckjb aowhaojlxnzc aohcahchk', 
            price: Math.floor(Math.random()*50)

        })
        await camp.save();
    }
    console.log('db seeded')
}

seedDB().then(() => {
    mongoose.connection.close(); // Close DB connection after seeding
});
