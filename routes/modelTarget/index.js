require('dotenv').config()
const express = require('express')
const router = express.Router()

const fs = require('fs')
const path = require('path')

router.get('/', (req, res, next) => {
  const filenames = fs.readdirSync(path.join(__dirname, '..', '..', 'modelTargets'))
  res.json(filenames)
})

router.get('/:modelTarget', (req, res, next) => {
  try {
    const modelTarget = req.params.modelTarget
    const Model = require(`../../modelTargets/${modelName}`)
    const schema = Model.schema
    const schemaFields = Object.keys(schema.obj)
    console.log('schema: ', schema);
    res.json({
      model: modelTarget,
      fields: schemaFields
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router