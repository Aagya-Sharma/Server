const express = require('express')

const{
    register,
    login,
    verifiedVerification,
    tokenValidation,
    authorization
} = require('../controller/authorizeController')

const userValidation = require('../validation/validation')

const router = express();


router.post('/register', userValidation, register)
router.post('/login', login)
router.get('/users/:id/verify/:token', verifiedVerification)
router.post('/tokenValidation', tokenValidation)


module.exports = router;