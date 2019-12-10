const express = require('express')
const router = express.Router()

const moment = require('moment')

router.use('/attachment', require('./attachment'))
router.use('/modeltarget', require('./modelTarget'))
router.use('/replacer', require('./replacer'))

router.use((err, req, res, next) => {
  console.log('ERROR:', err);
  if(!err.statusCode) {
    err.statusCode = 500
  }
  res.status(err.statusCode).send({
    statusCode: err.statusCode,
    message: err.message || 'unknown error'
  })
})

module.exports = router