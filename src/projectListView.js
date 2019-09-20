const vscode = require('vscode')
const storage = require('./storage')

module.exports = class ProjectListProvider {
  constructor(context) {
    this.iconPath = context.asAbsolutePath('image/icon.svg')
  }
  getTreeItem(element) {
    if (element.contextValue === 'category') {
      return {
        ...element,
        iconPath: this.iconPath
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
    console.log(storage.getCategoryList())
    return storage.getCategoryList()
  }
  getChildren(category) {
    if (category) {
      return storage.getCategoryChildren(category.label)
    } else {
      return storage.getCategoryList()
    }
  }
}
