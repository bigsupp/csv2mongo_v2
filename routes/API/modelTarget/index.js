require('dotenv').config()
const express = require('express')
const router = express.Router()

const moment = require('moment')

const {
  getFilenameModelTargets,
  getStatsSummary
} = require('../../../libs/ModelTarget')

router.get('/', (req, res, next) => {
  const filenames = getFilenameModelTargets()
  res.json(filenames)
})

router.get('/:modelTarget', (req, res, next) => {
  const modelTarget = req.params.modelTarget
  try {
    const Model = require(`../../../modelTargets/${modelTarget}`)
    const schema = Model.schema
    console.log(`model:${modelTarget} -> schema: `, schema.obj);
    const schemaFields = Object.keys(schema.obj).filter(v => v!=='ref_code')
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
  const modelTarget = req.params.modelTarget
  try {
    const Model = require(`../../../modelTargets/${modelTarget}`)
    const data = await Model.find({})
      .select(selectFields)
      .exec()
    res.json(data)
  } catch (error) {
    next(error)
  }
})

router.get('/:modelTarget/sample', async (req, res, next) => {
  const modelTarget = req.params.modelTarget
  try {
    const Model = require(`../../../modelTargets/${modelTarget}`)
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
  const modelTarget = req.params.modelTarget
  try {
    const Model = require(`../../../modelTargets/${modelTarget}`)
    const count = await Model.countDocuments()
    res.json(count)
  } catch (error) {
    next(error)
  }
})

router.get('/:modelTarget/search', async (req, res, next) => {
  const modelTarget = req.params.modelTarget
  try {
    const Model = require(`../../../modelTargets/${modelTarget}`)
    const conditions = {}
    if (req.query) {
      Object.keys(req.query).map(q => {
        if (req.query.exact && q !== 'exact') {
          conditions[q] = new RegExp("^" + req.query[q] + "$", 'i')
        } else if (q !== 'exact') {
          conditions[q] = new RegExp(req.query[q], 'ig')
        }
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
  const modelTarget = req.params.modelTarget
  try {
    const prop = req.params.prop
    const q = req.query.q
    const Model = require(`../../../modelTargets/${modelTarget}`)
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
        _id: `$${prop}`
      }
    })
    pipeline.push({
      $project: projectFinal
    })
    // console.log(pipeline)
    const doc = await Model.aggregate(pipeline).exec()
    const arr = doc.map(d => {
      return d[prop]
    })
    res.json(arr)
  } catch (error) {
    next(error)
  }
})

router.get('/:modelTarget/stats', async (req, res, next) => {
  const modelTarget = req.params.modelTarget
  try {
    const doc = await getStatsSummary(modelTarget)
    res.json(doc)
  } catch (error) {
    next(error)
  }
})

router.get('/:modelTarget/download', async (req, res, next) => {
  const selectFields = {
    _id: 0,
    created_at: 0,
    updated_at: 0,
    __v: 0
  }
  const modelTarget = req.params.modelTarget
  const currentRev = '-' + moment().format('YYYYMMDD-HHmmss')
  try {
    const Model = require(`../../../modelTargets/${modelTarget}`)
    const dataArray = await Model.find({})
      .select(selectFields)
      .lean()
      .exec()
    let headers = []
    let csvText = ''
    if (dataArray && dataArray.length > 0) {
      headers = Object.keys(dataArray[0])
    }
    if (!headers) {
      throw new Error('headers not found or invalid')
    }
    const lines = dataArray.map(d => headers.map(h => `"${d[h]}"`).join(","))
    csvText += headers.map(h => `"${h}"`).join(",")
    csvText += "\n"
    csvText += lines.join("\n")
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment;filename=${modelTarget}${currentRev}.csv`)
    res.send(csvText)
  } catch (error) {
    next(error)
  }
})

module.exports = router