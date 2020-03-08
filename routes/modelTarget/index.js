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

router.get('/:modelTarget/data', async (req, res, next) => {
  const selectFields = {
    ref_code: 0,
    created_at: 0,
    updated_at: 0,
    __v: 0
  }
  if (req.query.exclude) {
    const excludes = req.query.exclude.split(",")
    excludes.map(exclude => {
      selectFields[exclude] = 0
    })
  }
  try {
    const modelTarget = req.params.modelTarget
    const Model = require(`../../modelTargets/${modelTarget}`)
    const data = await Model.find({})
      .select(selectFields)
      .exec()
    res.json(data)
  } catch (error) {
    next(error)
  }
})

router.get('/:modelTarget/sample', async (req, res, next) => {
  try {
    const modelTarget = req.params.modelTarget
    const Model = require(`../../modelTargets/${modelTarget}`)
    const data = await Model.aggregate([{
      $sample: {
        size: 10
      }
    }]).exec()
    if (req.query.table) {
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

router.get('/:modelTarget/search', async (req, res, next) => {
  try {
    const modelTarget = req.params.modelTarget
    const Model = require(`../../modelTargets/${modelTarget}`)
    const conditions = {}
    if (req.query) {
      Object.keys(req.query).map(q => {
        conditions[q] = new RegExp(req.query[q], 'ig')
      })
    }
    const doc = await Model
      .find(conditions)
      .exec()
    // console.log('doc: ', doc);
    res.json(doc)
  } catch (error) {
    next(error)
  }
})

router.get('/:modelTarget/array/:prop', async (req, res, next) => {
  try {
    const modelTarget = req.params.modelTarget
    const prop = req.params.prop
    const q = req.query.q
    const Model = require(`../../modelTargets/${modelTarget}`)
    const project = {}
    project[prop] = 1
    const projectFinal = {
      _id: 0
    }
    projectFinal[prop] = '$_id'
    const pipeline = [{
      $project: project
    }]
    if (q && q.length > 0) {
      const propMatch = {
        $match: {}
      }
      propMatch['$match'][prop] = new RegExp(q, 'ig')
      pipeline.push(propMatch)
    }
    pipeline.push({
      $group: {
        _id: '$name_th'
      }
    })
    pipeline.push({
      $project: projectFinal
    })
    const doc = await Model.aggregate(pipeline).exec()
    const arr = doc.map(d => {
      return d[prop]
    })
    res.json(arr)
  } catch (error) {
    next(error)
  }
})

module.exports = router