const fs = require('fs')
const util = require('./util/index')
const vscode = require('vscode')
const ProjectListProvider = require('./view/projectList')
const controller = require('./controller/index')

function toast(text) {
  return vscode.window.showInformationMessage(text)
}
module.exports = {
  activate: function(context) {
    const projectListProvider = new ProjectListProvider(context)
    vscode.window.registerTreeDataProvider(
      'projectQListView',
      projectListProvider
    )
    // fs.watchFile(util.getProjectFilePath(), { interval: 100 }, (prev, next) => {
    //   util.loadProjectsFile()
    //   projectListProvider.refresh()
    // })
    context.subscriptions.push(
      vscode.commands.registerCommand('projectQ.active', function() {
        toast('projectQ: 激活成功!')
      })
    )
    // 添加新类别
    vscode.commands.registerCommand('projectQ.addCategory', () => {
      vscode.window
        .showInputBox({
          prompt: '新分组的名称',
          placeHolder: '输入分组名称',
          value: ''
        })
        .then(label => {
          if (!label) {
            vscode.window.showWarningMessage('必须输入新分组的名称.')
          } else {
            controller.category.add({ label })
            projectListProvider.refresh()
          }
        })
    })
    // 删除选中类别，该类别下的项目转移至default分类
    vscode.commands.registerCommand('projectQ.deleteCategory', payload => {
      if (payload.id === 'default') {
        toast('不能删除默认分类')
      } else {
        controller.category.delete(payload)
        toast('projectQ: 删除分组成功!')
        projectListProvider.refresh()
      }
    })
    // 当前打开的文件夹添加至项目列表
    vscode.commands.registerCommand('projectQ.addProject', () => {
      const categoryList = controller.category.getList()
      vscode.window
        .showQuickPick(categoryList.map(o => o.label + ': ' + o.id), {
          placeHolder: '选择分组'
        })
        .then(res => {
          const categoryId = res.split(':')[1]
          controller.project.add(categoryId)
          toast('projectQ: 添加项目成功!')
          projectListProvider.refresh()
        })
    })
    // 从列表中删除选中类别
    vscode.commands.registerCommand('projectQ.deleteProject', payload => {
      controller.project.delete(payload)
      toast('projectQ: 删除项目成功!')
      projectListProvider.refresh()
    })
    // 打开项目（切换项目）
    vscode.commands.registerCommand('projectQ.openProject', payload => {
      controller.project.open(payload)
    })
    // 打开项目（新窗口）
    vscode.commands.registerCommand(
      'projectQ.openProjectInNewWindow',
      payload => {
        controller.project.openInNewWindow(payload)
      }
    )
    // 重命名项目
    vscode.commands.registerCommand('projectQ.renameProject', payload => {
      vscode.window
        .showInputBox({
          prompt: '新名称',
          placeHolder: '请输入新的项目名',
          value: payload.label
        })
        .then(newName => {
          if (!newName) {
            vscode.window.showWarningMessage('必须输入新的项目名')
          } else {
            controller.project.edit({ ...payload, label: newName })
            projectListProvider.refresh()
          }
        })
    })
    // 修改项目分组
    vscode.commands.registerCommand('projectQ.changeCategory', project => {
      const categoryList = controller.category.getList()
      vscode.window
        .showQuickPick(categoryList.map(o => o.id + ': ' + o.label), {
          placeHolder: '选择项目分组'
        })
        .then(res => {
          const categoryId = res.split(':')[0]
          controller.project.changeCategory(project.id, categoryId)
          projectListProvider.refresh()
        })
    })
    // 刷新视图
    vscode.commands.registerCommand('projectQ.refresh', () => {
      projectListProvider.refresh()
    })
  }
}
