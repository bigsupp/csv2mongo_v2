const express = require('express');
const router = express.Router()

const mongoose = require('mongoose')

router.delete(`/:model/all`, async (req, res, next) => {
  const ref_code = req.body.ref_code || null
  if (!ref_code) {
    const error = new Error('ref_code is empty and/or invalid')
    error.statusCode = 400
    return next(error)
  }
  const modelName = req.params.model
  try {
    const Model = require(`../../modelTargets/${modelName}`)
    const deleted = await Model.deleteMany({
      ref_code
    }).exec()
    console.log(`deleted ref_code=${ref_code}:`, deleted);
    res.json(deleted)
  } catch (error) {
    next(error)
  }
})

module.exports = router