const vscode = require('vscode')
const storage2 = require('../controller/storage2')
const controller = require('../controller/index')
const db = require('../service/db')
const util = require('../util/index')

module.exports = class ProjectListProvider {
  constructor(context) {
    this.iconPath = context.asAbsolutePath('image/icon.svg')
    this.internalOnDidChangeTreeData = new vscode.EventEmitter()
    this.onDidChangeTreeData = this.internalOnDidChangeTreeData.event
  }
  refresh() {
    console.log('refresh')
    this.internalOnDidChangeTreeData.fire()
    return
  }
  getTreeItem(element) {
    if (element.contextValue === 'category') {
      return {
        ...element
        // iconPath: this.iconPath
      }
    } else {
      return {
        ...element,
        iconPath: this.iconPath,
        command: {
          command: 'projectQ.open',
          title: '',
          arguments: [element.rootPath]
        }
      }
    }
  }
  getParent() {
    console.log('getParent')
    console.log(storage2.getCategoryList())
    return storage2.getCategoryList()
  }
  getChildren(category) {
    if (category) {
      return controller.project.getListByCategory(category.id)
    } else {
      return controller.category.getList()
    }
  }
}
