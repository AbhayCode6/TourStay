const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const wrapAsync = require('../utils/wrapAsync.js')
const passport = require('passport')


router.get('/signup',(req,res)=>{
    res.render("./users/signup.ejs")
})

router.post('/signup',wrapAsync(async(req,res)=>{
    try{
    let {email,username,password} = req.body
    const newUser = User({email,username})
    const registerUser = await User.register(newUser,password)
    console.log(registerUser)
    req.flash('success','Welcome to TourStay!')
    res.redirect('/listings')
    }catch(err){
        req.flash("error",err.message)
        res.redirect('/signup')
    }
}))

router.get('/login',(req,res)=>{
    res.render('./users/login.ejs')
})

router.post('/login',
    passport.authenticate("local",
    {failureRedirect : "/login", failureFlash : true}),
    async(req,res)=>{
    req.flash("success","Welcome back to TourStay.")
    res.redirect('/listings')
})

router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }else{
            req.flash("success","You Are Logged Out!.")
            res.redirect('/listings')
        }
    })
})

module.exports = router
