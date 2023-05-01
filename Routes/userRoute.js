const express = require('express')


const{
    getAllUser,
    getUser,
    postUser,
    deleteUser,
    updateUser,
    addAppointment,
    deleteAppointment,
    getUserInfo
} = require('../controller/userController')

const{
    tokenValidation,
    authorization,
    verifiedVerification,
} = require('../controller/authorizeController')

const validation = require('../validation/validation')

const router = express();

router.get('/getUserInfo', getUserInfo)
router.get('/allUser', tokenValidation, authorization('admin'), getAllUser)
router.get('/user/:id', tokenValidation, authorization('admin', 'patient', 'psych'), getUser)
router.post('/addUser', tokenValidation, authorization('admin'), validation,  postUser)
router.delete('/:userId/deleteUser/:id', tokenValidation, authorization('admin', 'patient', 'psych'), deleteUser)
router.patch('/:userId/updateUser/:id', tokenValidation, authorization('admin', 'patient', 'psych'), updateUser)
router.patch('/addAppointment', tokenValidation, addAppointment)
router.patch('/deleteAppointment', tokenValidation, deleteAppointment)

module.exports = router