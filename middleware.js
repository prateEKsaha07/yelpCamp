module.exports.isLoggedIn = (req,res,next) =>{
    console.log('REQ.USER...',req.user)
    if(!req.isAuthenticated()){
        req.flash('error','you must be logged in');
        return res.redirect('/login');
    }
    next();
}