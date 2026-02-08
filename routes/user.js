const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const wrapAsync = require('../utils/wrapAsync.js')

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

module.exports = router