const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name_th: String,
  ref_code: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

try {
  module.exports = mongoose.model('MCHospital', schema)
} catch (error) {
  module.exports = mongoose.model('MCHospital')
}