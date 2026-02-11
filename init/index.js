const mongoose = require('mongoose')
const initData = require('./data.js');
const Listing = require('../models/listings.js');



const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb"

connectDb()
    .then(res=> console.log("Database connected.."))
    .catch(err=> console.log(err))

async function connectDb(){
    await mongoose.connect(MONGO_URL)
}

const initDB = async ()=>{
    await Listing.deleteMany({})
   const formattedData = initData.map((obj) => ({
    ...obj,
    owner: "698ca6805b26f2d94b1396d5"
    }))
    await Listing.insertMany(formattedData)
    console.log("Data Re-Initialized..")
}

initDB()