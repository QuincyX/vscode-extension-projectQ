const fs = require('fs')
const vscode = require('vscode')
const util = require('../util/index')

module.exports = {
  addProject(category, project) {
    let store = this.loadStore()
    const currentCategory = store.findIndex(e => e.category === category)
    if (currentCategory === -1) {
      store.push({ category, children: [] })
    }
    if (store[currentCategory].children.find(o => o.label === project.label)) {
      vscode.window.showInformationMessage(
        'projectQ: current project is already exist!'
      )
      return
    }
    store[currentCategory].children.push({
      ...project,
      tooltip: project.rootPath,
      contextValue: 'project'
    })
    this.saveStore(store)
    vscode.window.showInformationMessage(
      `projectQ: ${project.label} add to project list success!`
    )
    return this.loadStore()
  },
  deleteProject(projectLabel) {
    let store = this.loadStore()
    let isDelete = false
    store.forEach((c, n) => {
      const i = c.children.findIndex(p => p.label === projectLabel)
      if (i !== -1) {
        store[n].children.splice(i, 1)
        isDelete = true
      }
    })
    if (isDelete) {
      this.saveStore(store)
      vscode.window.showInformationMessage(
        `projectQ: delete ${projectLabel} success!`
      )
    } else {
      vscode.window.showInformationMessage(
        `projectQ: project ${projectLabel} not found!`
      )
    }
    return this.loadStore()
  },
  getCategoryList() {
    const store = this.loadStore()
    return store.map(e => {
      return {
        label: e.category,
        tooltip: e.children.length,
        collapsibleState: e.children.length ? 2 : 0,
        contextValue: 'category'
      }
    })
  },
  getCategoryChildren(category) {
    const store = this.loadStore()
    const currentCategory = store.find(e => e.category === category)
    return currentCategory
      ? currentCategory.children.map(e => {
          return {
            label: e.label,
            rootPath: e.rootPath,
            tooltip: e.rootPath,
            contextValue: 'project'
          }
        })
      : []
  },
  loadStore: function() {
    return JSON.parse(fs.readFileSync(util.getProjectFilePath()).toString())
  },
  saveStore: function(store) {
    return fs.writeFileSync(util.getProjectFilePath(), JSON.stringify(store))
  }
}
