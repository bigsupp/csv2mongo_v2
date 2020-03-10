const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  ward: String,
  type: String,
  dc_count: Number,
  ref_code: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

try {
  module.exports = mongoose.model('MCWardDailyDC', schema)
} catch (error) {
  module.exports = mongoose.model('MCWardDailyDC')
}