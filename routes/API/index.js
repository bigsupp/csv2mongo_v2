const express = require('express');
const router = express.Router()

router.use('/attachment', require('./attachment'))
router.use('/modeltarget', require('./modelTarget'))
router.use('/replacer', require('./replacer'))

module.exports = router