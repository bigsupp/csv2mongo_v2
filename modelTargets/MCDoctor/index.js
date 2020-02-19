const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name_th: String,
  contact_mobile: {
    type: [String],
    default: null
  },
  cert: [String],
  specialty: [String],
  ref_code: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

schema.pre('validate', function (next) {
  if (this.contact_mobile) {
    const contact_mobiles = this.contact_mobile[0].split(",")
    this.contact_mobile = contact_mobiles.map(val => val.replace(/\s+/g, '').replace(/-/g, ''))
  }
  next()
})

try {
  module.exports = mongoose.model('MCDoctor', schema)
} catch (error) {
  module.exports = mongoose.model('MCDoctor')
}