const db = require('../service/db')
const shortid = require('shortid')

module.exports = {
  addStar: function(payload) {
    if (payload) {
      return db
        .get('project')
        .getById(payload.id)
        .assign({ tag: ['star'] })
        .write()
    }
  },
  delStar: function(payload) {
    if (payload) {
      return db
        .get('tag')
        .getById(payload.id)
        .assign({ tag: [] })
        .write()
    }
  },
  getList: function() {
    return db
      .get('tag')
      .value()
      .map(e => {
        return {
          ...e,
          collapsibleState: 2,
          contextValue: 'category'
        }
      })
  }
}
