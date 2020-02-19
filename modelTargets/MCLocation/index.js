const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  floor: String,
  department: String,
  unit: String,
  alias: String,
  contact_name: String,
  contact_phone: [String],
  contact_fax: [String],
  ref_code: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

schema.pre('validate', function (next) {
if (this.contact_phone && this.contact_phone.length === 1) {
    const contact_phones = this.contact_phone[0].split(",")
    this.contact_phone = contact_phones.map(val => val.replace(/\s+/g, '').replace(/-/g, ''))
  }
  if (this.contact_fax && this.contact_fax.length === 1) {
    const contact_faxes = this.contact_fax[0].split(",")
    this.contact_fax = contact_faxes.map(val => val.replace(/\s+/g, '').replace(/-/g, ''))
  }
  next()
})

try {
  module.exports = mongoose.model('MCLocation', schema)
} catch (error) {
  module.exports = mongoose.model('MCLocation')
}