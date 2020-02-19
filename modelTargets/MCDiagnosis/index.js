const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  code: String,
  name: String,
  ref_code: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

try {
  module.exports = mongoose.model('MCDiagnosis', schema)
} catch (error) {
  module.exports = mongoose.model('MCDiagnosis')
}