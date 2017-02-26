"use strict";

const electron = require('electron')
const {app, BrowserWindow} = electron
const fs = require('fs')

function main() {

    let mainWindow

    function createWindow() {

        mainWindow = new BrowserWindow({width: 500, height: 400})
        mainWindow.loadURL(`file://${__dirname}/index.html`)
        // mainWindow.setMenu(null)

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
