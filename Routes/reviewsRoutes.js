const express = require('express')
const reviewCtrl = require('../controller/reviewsController')

const router = express();

router.route('/addReviews')
.post(reviewCtrl.addReview)

router.route('/reviews')
.get(reviewCtrl.getReviews)

router.route('/reviews/:id')
.patch(reviewCtrl.updateReview)



module.exports = router
