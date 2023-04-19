const User = require('../models/user')
const Token = require('../models/token')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const util = require('util')
const { use } = require('../Routes/authorizeRoute')

const signToken = id => {
    return jwt.sign({id}, "secret", {expiresIn: "1h"})
}

const tokenResponse = (user, statuscode, res) => {
    const token = signToken(user._id)
    res.status(statuscode).json({
        Status: "success",
        token,
        data: {
            user: user
        }
    })
}
const register = async (req, res, next) => {
    const registerResponse = req.body
    const existingUser = await User.findOne({email: registerResponse.email})
    if(!existingUser){
        try{
            if(registerResponse.password === registerResponse.confirmPassword){
                registerResponse.password = bcrypt.hashSync(registerResponse.password, 12)
                registerResponse.confirmPassword = bcrypt.hashSync(registerResponse.confirmPassword, 12)
                const registration = await new User(registerResponse).save()

                //code for email not verified

                if(registration.verified === false){  //checking if the use is verified
                    let tokens = await Token.findOne({userId: registration._id});  //finding the user based on its ID from Token
                    if(!tokens){ //Checking if token is available
                        tokens = await new Token({  //creating the new token for the user
                            userId: registration._id,  //giving user the ID
                            token: crypto.randomBytes(32).toString('hex')  //creating random token using the crypto package
                        }).save()

                        const url = `${process.env.BASE_URL}users/${registration._id}/verify/${tokens.token}`
                        
                        console.log(url)
                        await sendEmail(registration.email, "verify Email", url)
                        console.log("Email has been sent for verification")
                        return res.json("Email has been send for verification")
                    }
                }

                tokenResponse(registration, 200, res)
            }
        }catch(err){
          return res.json(err.message, "err")
        }
    }else{
        return res.json("User Already exist")
    }
}
const login = async (req, res, next) => {
    console.log("insode login")
    const loginObject = {
        email: req.body.email,
        password: req.body.password
    }
    console.log(loginObject)
    if(!loginObject.email || !loginObject.password){
        return res.status(500).json("Input all fields")
    }
    const existingUser = await User.findOne({email: loginObject.email})
    if(!existingUser){
        return res.status(500).json("Register First")
    }
    else{
        try{
            if (existingUser.password, bcrypt.compareSync(loginObject.password, existingUser.password)){
                if(existingUser.verified === false){
                    return res.status(400).json("Verify user First")
                } else {
                    tokenResponse(existingUser, 200, res)
                }
            }
        }catch(err){
            res.json(err.message)
        }
        // return res.status(200).json("Logged in")
    }

}



// const resendVerification = async(req, res, next => {

// })

const verifiedVerification = async(req, res, next) => {
    try{
         const user = await User.findOne({_id: req.params.id})
         if(!user){
            return res.status(400).json({   message: "Invalid link "})
         } 
        const tokens = await Token.findOne({id: req.params.id, token: req.params.token})

        console.log(req.params.id)

         if(!tokens){
            return res.status(400).json({ message: "Invalid link" })
         }

            await User.findOneAndUpdate({_id: user._id}, {verified: true})
            await tokens.remove()
            res.status(200).json("email verified successful")

    }catch(err){
        return res.status(500).json({ message: "Internal Server Error", err})
    }
}
//token validation if user has logged in

const tokenValidation = async(req, res, next) => {
    let token //creating token variable
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){  //checking if headers.authorization starts with bearer
        token = req.headers.authorization.split(' ')[1];   //separating with the space and storing token value in index
    }
    if(!token){
        return res.status(400).json("Need login for this activity")  //error if there is no token value
    }
    try{
        const decode = await util.promisify(jwt.verify)(token, "secret")  //Validating token
        console.log(decode)
        const user = await User.findById(decode.id)  //finding the token based on id from token 
        if(!user){
            return res.status(400).json("no such user")  //checking if there is user 
        }
        req.user = user  //storing user details in req.user
        next()
    }catch(err){
        res.status(500).json("Internal Server error")
    }
}

const authorization = (...roles) => {  //storing the roles in array
    return(req, res, next)=>{
        if(!roles.includes(req.user.role)){  //checking if user role is in roles
            return next(res.json("this task cannot be performed"))
        }
        next()
    }
}

module.exports = {
    register,
    login,
    tokenValidation,
    verifiedVerification,
    authorization
}