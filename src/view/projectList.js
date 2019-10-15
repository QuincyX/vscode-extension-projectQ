const vscode = require('vscode')
const controller = require('../controller/index')

module.exports = class ProjectListProvider {
  constructor(context) {
    this.listIconPath = context.asAbsolutePath('image/list.svg')
    this.folderIconPath = {
      light: context.asAbsolutePath('image/light/folder.svg'),
      dark: context.asAbsolutePath('image/dark/folder.svg')
    }
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
        // iconPath: this.listIconPath
      }
    } else {
      return {
        ...element,
        iconPath: this.folderIconPath,
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
  }
  getChildren(category) {
    if (category) {
      return controller.project.getListByCategory(category.id)
    } else {
      return controller.category.getList()
    }
  }
}
