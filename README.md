# csv2mongo_v2

- modelTargets directory contains information for mapping csv data into mongodb document.
- modelTarget files are just samples from one of our customer, feel free to delete or modify.
- modelTarget file is typical mongoose model as below:
```
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
```
- Schema fields have to be matched with csv headers.
