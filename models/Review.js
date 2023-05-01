const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
 
    Name:{
        type: String,
        required: true,
        maxlength: [25, "limit crossed"],
        minlength: [2, "atleast 2 words required"],
        trim: true
    },
    description: {
        type: String,
        required:true,
        trim: true,
    },
    Rating: {
        type: Number,
        required:true,
       
    }, images:{
        type: Object,
        default: ""
    },
}, {
    timestamps: true
})


module.exports = mongoose.model("Review", reviewSchema)