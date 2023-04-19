const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        maxlength: [25, "limit crossed"],
        minlength: [2, "atleast 2 words required"],
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        maxlength: [25, "limit crossed"],
        minlength: [2, "atleast 2 words required"],
        trim: true
    },
    email:{
        type: String,
        maxlength: [255, "limit Crossed"],
        required: true,
        unique: true,
        validate: [validator.isEmail, "emter the valid email address "]
    },
    password:{
        type: String,
        required: true,
        validate: [validator.isStrongPassword, "enter the valid password"]
    },
    confirmPassword:{
        type: String,
        required: true,
        validate: [validator.isStrongPassword, "enter the valid password"]
    },
    verified:{
        type: Boolean,
        default: false,
    },
    role:{
        type: String,
        required: true,
        enum:["admin", "psych", "patient"],
        lowercase: true,
        default: "patient"
    },
    cart:{
        type: Array,
        default: []
    }

}, {timestamps: true})

module.exports = mongoose.model('user', userSchema)
