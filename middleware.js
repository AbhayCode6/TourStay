const Listing = require("./models/listings")
const ExpressError = require('./utils/ExpressError.js')
const {listingSchema,reviewSchema} = require('./schema.js')
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","You Must Be Login")
        res.redirect('/login')
    }else{
        next()
    }
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currentuser._id)){
        req.flash("error","You are not Owner of this listing.")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(',')
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(',')
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}