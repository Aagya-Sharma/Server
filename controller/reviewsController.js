const User = require('../models/user')
const Review = require('../models/Review')
const util = require('util')
const jwt = require('jsonwebtoken')

//token fetch 
const tokens = req => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        return token = req.headers.authorization.split(" ")[1]

    }
}

//decoding token to find userid
const tokenId = async token => {
    const decode = await util.promisify(jwt.verify)(token, "secret")
    const idDecode = decode.id
    return idDecode
}

const addReview = async(req,res,next)=>{
    try{
    const {Name,description,Rating,images} = req.body;
    let token = tokens(req);
    if(token){

        await new Review({Name,description,Rating,images}).save();
        res.json({msg: "Created a new review"})
    }else{
        res.json({msg: "Need to login"})

    }
    }catch(err){
        return res.status(500).json({msg: err.message})
    }
}

const getReviews = async(req,res,next)=>{
    try{
        const reviews = await Review.find()
        res.json(reviews)

    }catch(err){
        return res.status(500).json({msg: err.message})
    }

}

const updateReview=async(req,res)=>{
    try{
        const {Name,description,Rating,images} = req.body;
        await Review.findOneAndUpdate({_id: req.params.id}, {Name,description,Rating,images})
        res.json({msg: "Updated a Review"})
    }catch(err){
        return res.status(500).json({msg: err.message})
    }
}

module.exports={
    addReview,
    getReviews,
    updateReview
}