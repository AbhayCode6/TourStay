const express = require('express')
const router = express.Router()
const Listing = require('../models/listings')
const wrapAsync = require('../utils/wrapAsync.js')
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")


//index Route
router.get('/',wrapAsync(async(req,res)=>{
   let allListing =await Listing.find({})
   res.render('listings/index', { allListing });
   console.log("Working..")
}))

// add new listing Route.
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('listings/new')
})

//show route
router.get('/:id',wrapAsync(async(req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id).
    populate({
    path: "reviews",
    populate: { path: "owner" }
    }).populate("owner")
    if(!listing){
        req.flash("error","Listing You Requested For Does Not Exists")
        return res.redirect('/listings')
    }
    console.log(listing)
    res.render('listings/show',{listing})
}))

//create Route
router.post('/',validateListing,isLoggedIn, wrapAsync(async(req,res)=>{   
    const newlisting = new Listing(req.body.listing)
    newlisting.owner = req.user._id // to add new listing onwer
    await newlisting.save()
    req.flash("success","New Listing Created!")
    res.redirect('/listings')
}))

//Edit Listing Route
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing You Requested For Does Not Exists")
        res.redirect('/listings')
    }
    res.render('listings/edit',{listing})
}))

//update Route
router.put('/:id',isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    let {id}= req.params

    Listing.findById(id)
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`)
}))

//delete route
router.delete('/:id',isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}= req.params
    const deleteListing =await Listing.findByIdAndDelete(id)
    console.log(deleteListing)
    req.flash("success","Listing Deleted!")
    res.redirect('/listings')
}))


module.exports = router
