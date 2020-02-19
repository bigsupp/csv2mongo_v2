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
    const Model = require(`../../modelTargets/${modelTarget}`)
    const schema = Model.schema
    const schemaFields = Object.keys(schema.obj)
    res.json({
      model: modelTarget,
      fields: schemaFields
    })
  } catch (error) {
    next(error)
  }
})

// router.get('/:modelTarget/data', async (req, res, next) => {
//   try {
//     const modelTarget = req.params.modelTarget
//     const Model = require(`../../modelTargets/${modelTarget}`)
//     Model.find({
      
//     })
//   } catch (error) {
//     next(error)
//   }
// })

router.get('/:modelTarget/sample', async (req, res, next) => {
  try {
    const modelTarget = req.params.modelTarget
    const Model = require(`../../modelTargets/${modelTarget}`)
    const data = await Model.aggregate([{
      $sample: {
        size: 10
      }
    }])
    if(req.query.table) {
      res.render('sample_data_table', {
        modelTarget,
        data
      })
      return
    }
    res.json(data)
  } catch (error) {
    next(error)
  }
})

router.get('/:modelTarget/count', async (req, res, next) => {
  try {
    const modelTarget = req.params.modelTarget
    const Model = require(`../../modelTargets/${modelTarget}`)
    const count = await Model.countDocuments()
    res.json(count)
  } catch (error) {
    next(error)
  }
})

module.exports = router