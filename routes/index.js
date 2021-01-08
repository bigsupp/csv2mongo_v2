const express = require('express')
const router = express.Router()

router.use('/api', require('./API'))
router.use('/', require('./Client'))
  
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