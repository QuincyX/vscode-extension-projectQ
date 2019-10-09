const vscode = require('vscode')
const util = require('../util/index')
const db = require('../service/db')

module.exports = {
  add: function(category = 'default') {
    const workspaceInfo = util.getWorkspaceInfo()
    return db
      .get('project')
      .insert({ ...workspaceInfo, category })
      .write()
  },
  open: function(project) {
    return vscode.commands.executeCommand(
      'vscode.openFolder',
      vscode.Uri.file(project.rootPath),
      false
    )
  },
  delete: function(project) {
    if (project) {
      return db
        .get('project')
        .remove({ id: project.id })
        .write()
    }
  },
  edit: function(project) {
    if (project) {
      return db
        .get('project')
        .getById(project.id)
        .assign(project)
        .write()
    }
  },
  changeCategory(projectId, category) {
    return db
      .get('project')
      .getById(projectId)
      .assign({ category })
      .write()
  },
  getListByCategory(category) {
    return db
      .get('project')
      .filter({ category })
      .value()
      .map(e => {
        return {
          ...e,
          contextValue: 'project'
        }
      })
  }
}
