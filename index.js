"use strict"

const electron = require('electron')
const {app, BrowserWindow} = electron
const fs = require('fs')

function main() {

    let mainWindow

    function createWindow() {

        mainWindow = new BrowserWindow({
            width: 800,
            height: 700,
            show: false,
            center: true,
        })
        
        mainWindow.loadURL(`file://${__dirname}/index.html`)

        mainWindow.on('ready-to-show', () => {
            mainWindow.show()
        })

        mainWindow.on('closed', function () {
            mainWindow = null
        })

    }

    app.on('ready', createWindow)

    app.on('window-all-closed', () => {
        app.quit();
    })
}

main()
