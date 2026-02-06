const express = require('express')
const router = express.Router()
const Listing = require('../models/listings')
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const {listingSchema} = require('../schema.js')



const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(',')
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

//index Route
router.get('/',wrapAsync(async(req,res)=>{
   let allListing =await Listing.find({})
   res.render('listings/index', { allListing });
   console.log("Working..")
}))

// add new listing Route.
router.get('/new',(req,res)=>{
    res.render('listings/new')
})

//show route
router.get('/:id',wrapAsync(async(req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id).populate("reviews")
    if(!listing){
        req.flash("error","Listing You Requested For Does Not Exists")
        res.redirect('/listings')
    }
    res.render('listings/show',{listing})
}))

//create Route
router.post('/',validateListing, wrapAsync(async(req,res)=>{   
    const newlisting = new Listing(req.body.listing)
    await newlisting.save()
    req.flash("success","New Listing Created!")
    res.redirect('/listings')
}))

//Edit Listing Route
router.get('/:id/edit',wrapAsync(async(req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing You Requested For Does Not Exists")
        res.redirect('/listings')
    }
    res.render('listings/edit',{listing})
}))

//update Route
router.put('/:id',validateListing,wrapAsync(async(req,res)=>{
    let {id}= req.params
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`)
}))

//delete route
router.delete('/:id',wrapAsync(async(req,res)=>{
    let {id}= req.params
    const deleteListing =await Listing.findByIdAndDelete(id)
    console.log(deleteListing)
    req.flash("success","Listing Deleted!")
    res.redirect('/listings')
}))


module.exports = router
