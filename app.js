const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsmate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

// const Review = require('./models/review')

const reviews = require('./routes/review.js')
const listings = require('./routes/listing.js')

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb"

connectDb()
    .then(res=> console.log("Database connected.."))
    .catch(err=> console.log(err))

async function connectDb(){
    await mongoose.connect(MONGO_URL)
}

const app = express()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:'true'}))
app.use(express.static(path.join(__dirname,'/public')))
app.engine('ejs',ejsmate)

const sessionOption = {
    secret : "thisissecretkey",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge :7*24*60*60*1000,
        httpOnly : true
    }
}


app.use(session(sessionOption))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})


app.use('/listings',listings)
app.use('/listings/:id/reviews',reviews)

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err
    res.status(statusCode).send(message)
})

app.listen(3000,()=>{
    console.log("Server is Running")
})