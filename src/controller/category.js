const vscode = require('vscode')
const db = require('../service/db')
const shortid = require('shortid')

module.exports = {
  add: function(category) {
    return db
      .get('category')
      .insert({ id: shortid.generate(), label: category.label })
      .write()
  },
  getList: function() {
    return db
      .get('category')
      .value()
      .map(e => {
        const childrenCount = db
          .get('project')
          .find({ category: e.id })
          .size()
          .value()
        return {
          ...e,
          collapsibleState: childrenCount ? 2 : 0,
          contextValue: 'category'
        }
      })
  },
  delete: function(category) {
    if (category) {
      db.get('project')
        .find({ category: category.id })
        .assign({ category: 'default' })
        .write()
      return db
        .get('category')
        .remove({ id: category.id })
        .write()
    }
  }
}
