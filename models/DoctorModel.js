const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
    doctor_id: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    price:{
        type: Number,
        trim: true,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    images:{
        type: Object,
        default: ""
    },
    category:{
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    available: {
        type: Number,
        default: 0
    }

},{
    timestamps: true
})

module.exports = mongoose.model("Doctors", doctorSchema)