const express = require('express');
const router = express.Router()

const moment = require('moment')

const {
  getFilenameModelTargets,
  getStatsSummary
} = require('../../libs/ModelTarget')

const debug = require('debug')('dcsapp:routes:client')

router.get('/', async (req, res, next) => {
  try {
    const modelTargetNames = getFilenameModelTargets()
    const modelStats = {}
    await Promise.all(modelTargetNames.map(async modelName => {
      try {
        const data = {
          modelTargetName: modelName,
          ref_code: {}
        }
        const stats = await getStatsSummary(modelName)
        if(!stats) {
          return null
        }
        stats.map(stat => {
          if(stat.ref_code) {
            data['ref_code'][stat.ref_code] = {
              count: stat.count
            }
          }
        })
        // console.log('data: ', data);
        modelStats[modelName] = data
      } catch (error) {
        debug('ERROR: %o', error)
      }
    }))
    res.render('home', {
      modelTargetNames,
      modelStats
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:model', (req, res) => {
  const target_model = req.params.model
  try {
    res.render('upload', {
      moment,
      target_model
    })
  } catch (error) {
    res.send(`Error target model is not found, <a href="/">back to home.</a>`)
  }
})

module.exports = router