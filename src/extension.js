const fs = require('fs')
const vscode = require('vscode')
const util = require('./util/index')
const ProjectListProvider = require('./view/projectList')
const controller = require('./controller/index')

function toast(text) {
  return vscode.window.showInformationMessage(text)
}
module.exports = {
  activate: function(context) {
    const projectListProvider = new ProjectListProvider(context)
    vscode.window.registerTreeDataProvider('projectQList', projectListProvider)
    fs.watchFile(util.getProjectFilePath(), { interval: 100 }, (prev, next) => {
      util.loadProjectsFile()
      projectListProvider.refresh()
    })
    context.subscriptions.push(
      vscode.commands.registerCommand('projectQ.active', function() {
        toast('projectQ: extension active!')
      })
    )
    vscode.commands.registerCommand('projectQ.addCategory', () => {
      let category = {
        name: ''
      }
      vscode.window
        .showInputBox({
          prompt: 'New Project Name',
          placeHolder: 'Type a name for the category',
          value: category.name
        })
        .then(label => {
          if (!label) {
            vscode.window.showWarningMessage(
              'You must define a new name for the project.'
            )
          } else {
            controller.category.add({ label })
            projectListProvider.refresh()
          }
        })
    })
    vscode.commands.registerCommand('projectQ.deleteCategory', payload => {
      if (payload.id === 'default') {
        toast('不能删除默认分类')
      } else {
        controller.category.delete(payload)
        toast('projectQ: delete category success!')
        projectListProvider.refresh()
      }
    })
    vscode.commands.registerCommand('projectQ.addProject', () => {
      controller.project.add()
      projectListProvider.refresh()
    })
    vscode.commands.registerCommand('projectQ.deleteProject', payload => {
      controller.project.delete(payload)
      toast('projectQ: delete project success!')
      projectListProvider.refresh()
    })
    vscode.commands.registerCommand('projectQ.openProject', payload => {
      controller.project.open(payload)
    })
    vscode.commands.registerCommand('projectQ.renameProject', payload => {
      vscode.window
        .showInputBox({
          prompt: 'New Project Name',
          placeHolder: 'Type a new name for the project',
          value: payload.label
        })
        .then(newName => {
          if (!newName) {
            vscode.window.showWarningMessage(
              'You must define a new name for the project.'
            )
          } else {
            controller.project.edit({ ...payload, label: newName })
            projectListProvider.refresh()
          }
        })
    })
    vscode.commands.registerCommand('projectQ.changeCategory', project => {
      const categoryList = controller.category.getList()
      console.log(categoryList)
      vscode.window
        .showQuickPick(categoryList.map(o => o.id + ': ' + o.label), {
          placeHolder: 'choose a category'
        })
        .then(res => {
          const categoryId = res.split(':')[0]
          controller.project.changeCategory(project.id, categoryId)
          projectListProvider.refresh()
        })
    })
    vscode.commands.registerCommand('projectQ.refresh', () => {
      projectListProvider.refresh()
    })
    vscode.commands.registerCommand('projectQ.list', function() {
      toast('projectQ list projects!')
    })
  }
}
