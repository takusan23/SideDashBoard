// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const { Tray, nativeImage } = require('electron')
const path = require('path')
const imagePath = path.join(__dirname, 'icon.png')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

//タスクバーのアイコン
let tray

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 300,         //横
        height: 900,        //縦
        frame: false,       //フレームなくす
        transparent: true,   //背景透明化
        skipTaskbar: true,  //タスクバーに表示しない
        webPreferences: {
            nodeIntegration: true   //これ書く。
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('./src/index.html')
    //メニューバー削除
    Menu.setApplicationMenu(null)

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })


    tray = new Tray(imagePath);

    // タスクトレイに右クリックメニューを追加
    var contextMenu = Menu.buildFromTemplate([
        { label: "表示", click: function () { mainWindow.focus(); } },
        { label: "終了", click: function () { mainWindow.close(); } }
    ]);
    tray.setContextMenu(contextMenu);

    // タスクトレイのツールチップをアプリ名に
    tray.setToolTip(app.getName());

    // タスクトレイが左クリックされた場合、アプリのウィンドウをアクティブに
    tray.on("click", function () {
        mainWindow.focus();

        var spawn = require('child_process').spawn;

        temp = spawn('cat', ['/sys/class/thermal/thermal_zone0/temp']);

        temp.stdout.on('data', function (data) {
            console.log('Result: ' + data / 1000 + ' degrees Celcius');
        });

    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

    createWindow()

})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (mainWindow === null) createWindow()    
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.