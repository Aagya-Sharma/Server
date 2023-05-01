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



const getReview = async (req, res, next) => {
    let token = tokens(req)
    const decode = await tokenId(token)
    const user = await User.findById(decode)
    if (!user) {
        return res.status(400).json("no such user")
    }
    try {
        const review = await Review.findById(req.params.id)
        if (review.userId === decode || user.role === "admin") {
            res.status(200).json(review)
        } else {
            return res.statu(400).json("You cannot perform this task")
        }
    } catch (err) {
        res.status(500).json("Internal Server Error", err)
    }
}


const getAllReview = async (req, res, next) => {
    try {
        const allReview = await Review.find({
            userId: req.user.id
        })
        console.log(req.user.id)
        res.json(allReview)
    } catch (err) {
        res.json(err)
    }

}

const userReview = async (req, res, next) => {
    const reviewObject = req.body
    let token = tokens(req)
    const decode = await tokenId(token)
    try {
        const reviewingUser = await User.findById(req.params.id)
        if (!reviewingUser) {
            return res.status(400).json("No Such User")
        } else {
            if (reviewingUser.role === "patient" || reviewingUser.role === "admin") {
                const user = await User.findById(req.params.userId)
                if (!user) {
                    return res.status(400).json("no such user")
                }
                if (user.verified === false) {
                    return res.status(400).json("user needs to verified")
                }
                if (user._id === decode || user.role === "patient" || user.role === "admin") {
                    return res.status(400).json("Cannot review user")
                }
                if (user.role === "psych") {
                    reviewObject.userId = decode
                    reviewObject.reviewedUserId = req.params.userId
                    const review = await new Review(reviewObject).save()
                    console.log(review.userReviewId)
                    res.json(review)
                } else {
                    return res.status(400).json("Cannot review user")
                }
            } else {
                return res.status(400).json("invalid role")
            }
        }
    } catch (err) {
        res.status(500).json("Internal Sever Error", err)
    }
}


const deleteReview = async (req, res, next) => {
    let token = tokens(token)
    const decode = await tokenId(token)
    const user = await User.findById(decode)
    if (!user) {
        return res.statu(400).json("No Such User")
    }
    try {
        const review = await Review.findById(req.params.id)
        if (!review) {
            return res.status(400).json("No Such Review")
        }
        if (review.userId === decode && user.role === "admin") {
            const deleteReview = await Review.findByIdAndDelete(req.params.id)
            if (!deleteReview) {
                return res.status(400).json("No review")
            } else {
                res.json(deleteReview)
            }
        }
    } catch (err) {
        return res.status(500).json("Internal Server Error", err)
    }

}

const updateReview = async (req, res, next) => {
    const updateObject = req.body
    const {
        description
    } = updateObject
    let token = tokens(req)
    const decode = await tokenId(token)
    const user = await User.findById(decode)
    if (!user) {
        return res.status(400).json("No Such User")
    }
    try {
        const review = await Review.findById(req.params.id)

        if (review.userId === decode || user.role === "admin") {
            const updateReview = await Review.findByIdAndUpdate(req.params.id, {
                $set: updateObject
            })
            if (!updateReview) {
                return res.status(400).json("Nothing to update")
            } else {
                res.status(200).json(updateReview)
            }
        } else {
            return res.status(400).json("Invalid Request")
        }

    } catch (err) {
        res.status(500).json("internal server Err", err)
    }
}

module.exports = {
    getReview,
    getAllReview,
    userReview,
    deleteReview,
    updateReview
}