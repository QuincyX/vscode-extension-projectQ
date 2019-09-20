const fs = require('fs')
const os = require('os')
const path = require('path')
const vscode = require('vscode')

function getFilePathFromAppData() {
  let appData
  let filePath
  const channelPath = process.env.VSCODE_PORTABLE
    ? 'user-data'
    : vscode.env.appName.replace('Visual Studio ', '')
  if (process.env.VSCODE_PORTABLE) {
    appData = process.env.VSCODE_PORTABLE
    filePath = path.join(appData, channelPath, 'User', 'projectQ.json')
  } else {
    appData =
      process.env.APPDATA ||
      (process.platform === 'darwin'
        ? process.env.HOME + '/Library/Application Support'
        : '/var/local')
    filePath = path.join(appData, channelPath, 'User', 'projectQ.json')
    if (process.platform === 'linux' && !fs.existsSync(filePath)) {
      filePath = path.join(
        os.homedir(),
        '.config/',
        channelPath,
        'User',
        'projectQ.json'
      )
    }
    return filePath
  }
}
function getProjectFilePath() {
  let configFile
  const configLocation = vscode.workspace
    .getConfiguration('projectQ')
    .get('configLocation')
  if (configLocation) {
    configFile = path.join(configLocation, 'projectQ.json')
  } else {
    configFile = getFilePathFromAppData()
  }
  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(
      configFile,
      JSON.stringify({
        default: [{ name: 'test', root: '/' }],
        favorite: []
      })
    )
  }
  return configFile
}

module.exports = {
  add(category, project) {
    let store = JSON.parse(fs.readFileSync(getProjectFilePath()).toString())
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
    store[currentCategory].children.push(project)
    fs.writeFileSync(getProjectFilePath(), JSON.stringify(store))
    vscode.window.showInformationMessage(
      `projectQ: ${project.label} add to project list success!`
    )
    return JSON.parse(fs.readFileSync(getProjectFilePath()).toString())
  },
  delete(label) {},
  getCategoryList() {
    const store = JSON.parse(fs.readFileSync(getProjectFilePath()).toString())
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
    const store = JSON.parse(fs.readFileSync(getProjectFilePath()).toString())
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
  }
}
