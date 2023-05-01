const express = require('express')

const {
    tokenValidation,
    authorization
} = require('../controller/authorizeController')

const {
    getAllReview,
    getReview,
    userReview,
    deleteReview,
    updateReview
} = require('../controller/reviewController')

const router = express();

router.post('/user/:id/review/:userId', tokenValidation, authorization('patient', 'admin'), userReview)
router.get('/reviewAll', tokenValidation, authorization('patient', 'admin', 'psych'), getAllReview)
router.get('/user/review/:id', tokenValidation, authorization('admin', 'patient', 'psych'), getReview)
router.patch('/user/reviewUpdate/:id', tokenValidation, authorization("admin", "patient"), updateReview)
router.delete('/user/reviewDelete/:id', tokenValidation, authorization('admin', 'patient'), deleteReview)

module.exports = router