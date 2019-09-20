const vscode = require('vscode')
const storage = require('./storage')
const ProjectListProvider = require('./projectListView')

module.exports = function(context) {
  vscode.window.registerTreeDataProvider(
    'projectQList',
    new ProjectListProvider(context)
  )
  context.subscriptions.push(
    vscode.commands.registerCommand('projectQ.active', function() {
      vscode.window.showInformationMessage('projectQ: extension active!')
    })
  )
  vscode.commands.registerCommand('projectQ.add', function() {
    let projectName, rootPath
    const workspace0 = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0]
      : undefined
    rootPath = workspace0 ? workspace0.uri.fsPath : undefined
    if (!rootPath) {
      vscode.window.showInformationMessage(
        'projectQ: Open a folder first to save a project'
      )
      return
    }
    if (process.platform === 'win32') {
      projectName = rootPath.substr(rootPath.lastIndexOf('\\') + 1)
    } else {
      projectName = rootPath.substr(rootPath.lastIndexOf('/') + 1)
    }
    storage.add('default', { projectName, rootPath })
  })
  vscode.commands.registerCommand('projectQ.open', function(path) {
    const uri = vscode.Uri.file(path)
    vscode.commands.executeCommand('vscode.openFolder', uri, false).then(() => {
      vscode.window.showInformationMessage('projectQ: open project success!')
    })
  })
  vscode.commands.registerCommand('projectQ.list', function() {
    vscode.window.showInformationMessage('projectQ list projects!')
  })
}
