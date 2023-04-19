const router = require('express').Router()
const doctorCtrl = require('../controller/doctorCtrl')

router.route('/doctors')
.get(doctorCtrl.getDoctors)
.post(doctorCtrl.createDoctor)


router.route('/doctors/:id')
.delete(doctorCtrl.deleteDoctor)
.patch(doctorCtrl.updateDoctor)

module.exports = router