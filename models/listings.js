const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "default.jpg"
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1736618625630-e74054b9b54d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687"
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : "Review"
    }
  ]
});

//post mongoose middleware(to delete listing reviews)
listingSchema.post('findOneAndDelete',async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}})
  }
})

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
