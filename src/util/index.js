const vscode = require('vscode')
const fs = require('fs')
const os = require('os')
const path = require('path')
const util = require('util')

module.exports = {
  logObject: function(obj) {
    console.log(util.inspect(obj, { showHidden: false, depth: null }))
  },
  getWorkspaceInfo: function() {
    let label, rootPath
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
      label = rootPath.substr(rootPath.lastIndexOf('\\') + 1)
    } else {
      label = rootPath.substr(rootPath.lastIndexOf('/') + 1)
    }
    return {
      label,
      rootPath
    }
  },
  getProjectFilePath: function() {
    let configFile
    const configLocation = vscode.workspace
      .getConfiguration('projectQ')
      .get('configLocation')
    if (configLocation) {
      configFile = path.join(configLocation)
    } else {
      configFile = this.getFilePathFromAppData()
    }
    return configFile
  },
  getFilePathFromAppData: function() {
    let appData
    const fileName = 'db.json'
    const channelPath = process.env.VSCODE_PORTABLE ? 'user-data' : '.vscode'
    if (process.env.VSCODE_PORTABLE) {
      appData = process.env.VSCODE_PORTABLE
    } else {
      appData =
        process.env.USERPROFILE ||
        (process.platform === 'darwin'
          ? process.env.HOME + '/Library/Application Support'
          : '/var/local')
    }
    const folderPath = path.join(appData, channelPath, 'projectQ')
    const filePath = path.join(folderPath, fileName)
    if (!fs.existsSync(filePath)) {
      const folder = fs.existsSync(folderPath)
      if (!folder) {
        fs.mkdirSync(folderPath)
      }
      fs.writeFileSync(
        filePath,
        JSON.stringify({
          category: [
            {
              id: 'default',
              label: 'default',
              tooltip: 'default project list'
            }
          ],
          project: [],
          tags: []
        })
      )
    }
    return filePath
  }
}
