const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalmongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
})

User.plugin(passportlocalmongoose)

module.exports = mongoose.Model("User","userSchema")