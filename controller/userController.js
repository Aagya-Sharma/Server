const User = require('../models/user')
const util = require('util')
const Token = require('../models/token')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')



const response = (statusCode, data, res) => {
  res.status(statusCode).json({status:"successful", data: data})
}


//token fetch 
const tokens = req => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        return token = req.headers.authorization.split(" ")[1]
    }
}


//decoding token to find userid
const tokenId = async token => {
    const decode = await util.promisify(jwt.verify)(token, "secret" )
    const idDecode = decode.id
    return idDecode
}



const getUser = async(req, res, next)=>{
    
     let token = tokens(req)
     const decode = await tokenId(token)
     const user = await User.findOne({_id: decode})
     if(!user){
      res.status(400).json("no such user exist")
     }
     try{
      if(user.role == "admin" && req.params.id == decode){
        const currentUser = await User.findById(decode)
        if(!currentUser){
          res.status(400).json("No Such User")
        }
        response(200, currentUser, res)
      }
     }catch(err){
      res.status(500).json("No Such User")
     }
}

const getUserInfo= async (req, res) =>{
  try {
    let token = tokens(req)
     const decode = await tokenId(token)
     const user = await User.findOne({_id: decode}).select('-password')
     console.log("from getUser info function",user)
      // const user = await Users.findById(req.user.id).select('-password')
      if(!user) return res.status(400).json({msg: "User does not exist."})

      res.json(user)
  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
}

const getAllUser = async(req, res, next)=>{
    let token = tokens(req) 
    const decode = await tokenId(token)
    console.log(decode)
  try{
    const user = await User.find()
    if(!user){
      return res.json(400).json("no user found")
    }
    response(200, user, res)
  }catch(err){
    return res.status(500).json("Internal Server Error", err)
  }
}

const postUser = async(req, res, next) => {
  let token = await tokens(req)
  const decode = await tokenId(token)
  const user = await User.findOne({_id: decode})
  try{
    if(!user){
      return res.status(400).json("No Such User")
    }
    if(user.role === 'admin'){
      const registerObject = req.body
      const existingUser = await User.findOne({email: req.body.email})
      if(existingUser){
        return res.status(400).json("User already exist")
      }
      if(registerObject.password === registerObject.confirmPassword){
        registerObject.password = bcrypt.hashSync(registerObject.password, 12)
        registerObject.confirmPassword = bcrypt.hashSync(registerObject.confirmPassword, 12)
        const registration = await new User(registerObject).save()

        //code for email not verified

        if(registration.verified === false){  //checking if the use is verified
            let VerifyToken = await Token.findOne({userId: registration._id});  //finding the user based on its ID from Token
            if(!VerifyToken){ //Checking if token is available
                VerifyToken = await new Token({  //creating the new token for the user
                    userId: registration._id,  //giving user the ID
                    token: crypto.randomBytes(32).toString('hex')  //creating random token using the crypto package
                }).save()
                console.log(VerifyToken.token);
                const url = `${process.env.BASE_URL}users/${registration._id}/verify/${VerifyToken.token}`
                console.log(url)
                await sendEmail(registration.email, "verify Email", url)
                res.status(400).json("Email has been send for verification")
            }
      }
    }else{
      return res.status(400).json("password didnt match")
    }
  }else{
    return res.status(400).json("You Cannot Perform this task")
  }}catch(err){
    res.status(500).json("Error")
  }

}


const deleteUser = async(req, res, next) => {
  let token = await tokens(req)
  const decode = await tokenId(token)
  const user = await User.findOne({_id: decode})
  try{
    if(!user){
      res.status(400).json("No Such User")
    }
    if(req.params.userId === decode || user.role === "admin"){
      const deleteUser = await User.findByIdAndDelete(req.params.id)
      if(!deleteUser){
        res.status(400).json("no Such User")
      }
      response(200, user, res)
    }else{
      res.status(400).json("you cannot do this taske")
    }
  }catch(err){
    res.status(500).json("Internal Server Error")
  }

}

const updateUser = async(req, res, next) => {
  let token = await tokens(req)
  const decode = await tokenId(token)
  const user = await User.findOne({_id: decode})
  try{
    if(!user){
      return res.status(400).json("no such user found")
    }
    if(req.params.userId === decode || user.role === "admin"){
      const patchObject = req.body
    const{firstName, lastName, email, password} = patchObject
      if(!patchObject.password){
      return res.status(400).json("Password required")
     }
     if(patchObject.password, bcrypt.compareSync(patchObject.password, user.password)){
      const updateUser = await User.findByIdAndUpdate(req.params.id, {$set: patchObject})
      res.status(200).json(updateUser)
      }else{
        return res.status(400).json("password didnt match")
      }
    }else{
      return res.status(400).json("you cannot perform this taks")
    }

  }catch(err){
     res.status(500).json("Internal Server Error",err)
  }

}

const addAppointment = async(req, res)=>{
  try{
    const user = await User.findById(req.user.id)
    if(!user) return res.status(400).json({msg: "User does not exist"})

    await User.findByIdAndUpdate({_id: req.user.id}, {
        cart : req.body.cart
    })
    return res.json({msg: "Added to Cart"})

}catch(err){
    return res.status(500).json({msg: err.message})

}
  
}

const deleteAppointment = async(req, res)=>{
  try{
    const user = await User.findById(req.user.id)
    if(!user) return res.status(400).json({msg: "User does not exist"})

    await User.findByIdAndUpdate({_id: req.user.id}, {
        cart : req.body.cart
    })
    return res.json({msg: "Removed from Cart"})

}catch(err){
    return res.status(500).json({msg: err.message})

}
  
}


module.exports = {
    getUser,
    getAllUser,
    postUser,
    deleteUser,
    updateUser,
    addAppointment,
    deleteAppointment,
    getUserInfo
}