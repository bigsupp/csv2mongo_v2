const fs = require('fs')
const path = require('path')

const debug = require('debug')('dcsapp:libs:ModelTarget')

exports.getFilenameModelTargets = () => {
  const filenames = fs.readdirSync(path.join(__dirname, '../../modelTargets'))
  return filenames
}

exports.getStatsSummary = async (modelTarget) => {
  const Model = require(`../../modelTargets/${modelTarget}`)
  try {
    const doc = await Model
      .aggregate([{
          $group: {
            _id: '$ref_code',
            count: {
              $sum: 1
            },
          }
        }, {
          $project: {
            _id: 0,
            ref_code: '$_id',
            count: 1
          }
        }
      ])
      .exec()
    return doc
  } catch (error) {
    debug('ERROR: %o', error);
    return null
  }
}