const router = require('express').Router()
const doctorCategory = require('../controller/doctorCatrogyCtrl')
const{
    tokenValidation,
    authorization
}= require('../controller/authorizeController')


router.route('/doctorCategory')
.get(doctorCategory.getCategories)
.post(tokenValidation,authorization('admin'), doctorCategory.createCategory)


router.route('/category/:id')
.delete(tokenValidation,authorization('admin'),doctorCategory.deleteCategory)
.patch(tokenValidation,authorization('admin'), doctorCategory.updateCategory)

module.exports = router
