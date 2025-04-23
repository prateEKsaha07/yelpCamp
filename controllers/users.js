const User = require('../models/user');


module.exports.showSignupForm = (req,res)=>{
    res.render('users/register');
}

module.exports.handleSignup = async (req,res,next) =>{
    try{
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registered = await User.register(user,password);
        req.login(registered,(err)=>{
            if(err) return next(err);
            console.log(registered);
            req.flash('welcome to yelpcamp');
            res.redirect('/campground');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
} 

module.exports.showLoginForm = (req,res)=>{
    res.render('users/login');
}

module.exports.handleLogin = (req,res)=>{
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    console.log(redirectUrl)
    req.flash('success','welcome back!');
    res.redirect(redirectUrl);
}

module.exports.handleLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out!');
        res.redirect('/campground');
    });
}