module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You Must Be Login")
        res.redirect('/login')
    }else{
        next()
    }
}
