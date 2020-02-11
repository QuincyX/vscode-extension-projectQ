const vscode = require('vscode')
const controller = require('../controller/index')

module.exports = class TagListProvider {
  constructor(context) {
    this.listIconPath = context.asAbsolutePath('image/icon/list.svg')
    this.folderIconPath = {
      light: context.asAbsolutePath('image/light/folder.svg'),
      dark: context.asAbsolutePath('image/dark/folder.svg')
    }
    this.internalOnDidChangeTreeData = new vscode.EventEmitter()
    this.onDidChangeTreeData = this.internalOnDidChangeTreeData.event
  }
  refresh() {
    this.internalOnDidChangeTreeData.fire()
  }
  getChildren(payload) {
    return controller.project.getListByTag('star')
    if (payload) {
      return controller.project.getListByTag(payload.id)
    } else {
      return controller.tag.getList()
    }
  }
  getTreeItem(element) {
    if (element.contextValue === 'category') {
      return {
        ...element
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
}
