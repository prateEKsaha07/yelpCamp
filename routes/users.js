const express = require('express');
const router =  express.Router();
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');

//controller
const users = require('../controllers/users')


// signup of register route
router.get('/register',users.showSignupForm)

router.post('/register', catchAsync(users.handleSignup));

// login route
router.get('/login',users.showLoginForm)

router.post('/login',
    passport.authenticate('local',{
        failureFlash:true,
        failureRedirect:'/login'
    }
),users.handleLogin)
//returnTo is not working

//logout
router.get('/logout', users.handleLogout);


module.exports = router;


