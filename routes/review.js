const express = require('express')
const router = express.Router({mergeParams:true})
const Review = require('../models/review')
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const Listing = require('../models/listings')
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware.js')


router.post('/',isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newreview = new Review(req.body.review)

    newreview.owner = req.user._id
    listing.reviews.push(newreview)
    req.flash("success","New Review Added!")

    await newreview.save()
    await listing.save()

   res.redirect(`/listings/${listing._id}`)
}))

//Delete Review
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params

    await Listing.findByIdAndUpdate(id,{$pull :{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted!")

    res.redirect(`/listings/${id}`)
}))

module.exports = router