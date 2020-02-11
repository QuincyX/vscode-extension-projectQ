const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')
const util = require('../util/index')
const adapter = new FileSync(util.getProjectFilePath())
const db = low(adapter)
db._.mixin(lodashId)

db.defaults({
  category: [
    {
      id: 'default',
      label: 'default',
      tooltip: 'default project list'
    }
  ],
  project: [],
  tag: [
    {
      id: 'star',
      label: 'star'
    }
  ]
}).write()

module.exports = db
