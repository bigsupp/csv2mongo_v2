const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  filename: String,
  filename_orig: String,
  encoding: String,
  mimetype: String,
  size: Number,
  active: {
    type: Number,
    default: 1
  },
  expired_at: {
    type: Date,
    default: Date.now,
    index: {
      expires: '1h'
    }
  },
  meta: Object
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('Attachment', schema);