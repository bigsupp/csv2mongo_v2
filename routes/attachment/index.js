require('dotenv').config()
const express = require('express')
const router = express.Router()

const Attachment = require('../../models/attachment')

const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
const shortid = require('shortid')
const moment = require('moment')
const fs = require('fs')
const csv = require('neat-csv')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // console.log('destination:', file)
    callback(null, path.join(__dirname, '../../', process.env.UPLOAD_DIRECTORY))
  },
  filename: (req, file, callback) => {
    // console.log('filename:', file)
    let filenameParts = []
    if (req.body && req.body.postID) {
      filenameParts.push(req.body.postID)
    }
    filenameParts.push(Date.now())
    filenameParts.push(shortid.generate())
    filenameParts.push(shortid.generate())
    callback(null, filenameParts.join('$') + path.extname(file.originalname))
  },
  fileFilter: (req, file, callback) => {
    console.log('fileFilter:', file)
    callback(null, true)
  }
})

const Upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.UPLOAD_MAXIMUM_FILE_SIZE
  }
}).single(process.env.UPLOAD_FIELD_NAME)

//

router.get('/:id', (req, res, next) => {
  Attachment.findById(req.params.id)
    .exec()
    .then(attachment => {
      if (!attachment) {
        const error = new Error('reference is invalid and/or attachment not found')
        error.statusCode = 400
        throw error
      }
      res.json(attachment)
    })
    .catch(next)
})

router.get('/:id/sample/:rowCount', (req, res, next) => {
  Attachment.findById(req.params.id)
    .exec()
    .then(attachment => {
      if (!attachment) {
        const error = new Error('reference is invalid and/or attachment not found')
        error.statusCode = 404
        return next(error)
      }
      let rowCount = parseInt(req.params.rowCount)
      rowCount = (rowCount >= 1 && rowCount <= 20) ? rowCount : 10
      const rs = fs.createReadStream(
        path.join(__dirname, `../../uploads`, attachment.filename)
      )
      csv(rs)
        .then(rows => res.json({
          rows: rows.length,
          sample: rows.slice(0, rowCount)
        }))
        .catch(next)
    })
    .catch(next)
})

router.get('/:id/count', (req, res, next) => {
  Attachment.findById(req.params.id)
    .exec()
    .then(attachment => {
      if (!attachment) {
        const error = new Error('reference is invalid and/or attachment not found')
        error.statusCode = 404
        return next(error)
      }
      const rs = fs.createReadStream(
        path.join(__dirname, `../../uploads`, attachment.filename)
      )
      csv(rs)
        .then(rows => {
          res.json({
            rows: rows.length
          })
        })
        .catch(next)
    })
    .catch(next)
})

router.get('/:id/data', async (req, res, next) => {
  try {
    const attachment = await Attachment.findById(req.params.id)
    if (!attachment) {
      const error = new Error('reference is invalid and/or attachment not found')
      error.statusCode = 404
      throw error
    }
    const rs = fs.createReadStream(
      path.join(__dirname, `../../uploads`, attachment.filename)
    )
    const rows = await csv(rs)
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

router.post('/', (req, res) => {
  Upload(req, res, (error) => {
    const {
      filename,
      mimetype
    } = req.file
    if (error) {
      console.log('ERROR upload:', error)
      return res.status(500).json({
        error
      })
    }
    const attachment = new Attachment({
      expired_at: moment(),
      filename: req.file.filename,
      filename_orig: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      size: req.file.size
    })
    attachment.save()
      .then(saved => {
        res.status(201).json({
          _id: saved._id,
          created_at: saved.created_at,
          filename: saved.filename,
          filename_orig: saved.filename_orig
        })
      })
  })
})

router.put(`/:id/dump`, async (req, res, next) => {
  try {
    const modelTarget = req.body.target || null
    if (!modelTarget) {
      const error = new Error('targetModel is empty and/or invalid')
      error.statusCode = 400
      return next(error)
    }
    const ref_code = req.body.ref_code || null
    if (!ref_code) {
      const error = new Error('ref_code is empty and/or invalid')
      error.statusCode = 400
      return next(error)
    }
    const attachment = await Attachment.findById(req.params.id)
    if (!attachment) {
      const error = new Error('reference is invalid and/or attachment not found')
      error.statusCode = 404
      throw error
    }
    const rs = fs.createReadStream(
      path.join(__dirname, `../../uploads`, attachment.filename)
    )
    const rows = await csv(rs)
    rows.forEach(row => row.ref_code = ref_code)
    const Model = require(`../../modelTargets/${modelTarget}`)
    const inserted = await Model.insertMany(rows)
    const insertedResult = {
      insertedCount: inserted.length,
      ok: 1
    }
    console.log(`inserted modelTarget=${modelTarget} ref_code=${ref_code}:`, insertedResult);
    res.json(insertedResult)
  } catch (error) {
    next(error)
  }
})

module.exports = router