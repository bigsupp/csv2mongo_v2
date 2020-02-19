const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  ward: String,
  room_no: String,
  type: String,
  ref_code: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

try {
  module.exports = mongoose.model('MCWardRoom', schema)
} catch (error) {
  module.exports = mongoose.model('MCWardRoom')
}