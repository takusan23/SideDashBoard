window.onload = function () {
    //起動時
    if (localStorage.getItem('rss_check') == "true") {
        document.getElementById('rss_card').style.display = "none"
    }
}

setInterval(function (e) {
    //時計
    var date = new Date()
    //時間
    var clock = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    document.getElementById('clock').innerText = clock
    //日付
    var list = ["日", "月", "火", "水", "木", "金", "土"]
    var day = date.getMonth() + 1 + "/" + date.getDate() + " " + list[date.getDay()] + "曜日"
    document.getElementById('date').innerText = day

    getCPUUsage()
    getBattery()
    getRAMUsage()

}, 1000)

const sys = require('systeminformation');

var osu = require('node-os-utils')
var os = require('os')
const batteryLevel = require('battery-level')
const client = require('cheerio-httpcli')
var mainWindow

function getBattery() {
    //電池
    batteryLevel().then(level => {
        document.getElementById('battery').innerText = (level * 100) + "%"
    })
    sys.battery(battery).then(battery => {
        document.getElementById('batterylife').innerText = "残り " + battery.timeremaining + "分"
    })
}


function getCPUUsage() {
    var cpu = osu.cpu
    //使用率   
    cpu.usage()
        .then(usage => {
            document.getElementById('cpuusage').innerText = usage + "%"
        })

    //温度
    sys.cpuTemperature().then(cpu => {
        document.getElementById('cputemp').innerText = cpu.main + "度"
    })

    //CPUの名前
    document.getElementById('cpuname').innerText = cpu.model()
}

function getRAMUsage() {
    //メモリ使用量
    var ram = osu.mem
    ram.used().then(usage => {
        document.getElementById('ramusage').innerText = usage.usedMemMb + "GB"
    })
    //トータル
    var gb = ram.totalMem() / (1073741824)
    gb = Math.round(gb)
    document.getElementById('ramtotal').innerText = gb + "GB"
}

function windowClose() {
    const remote = require('electron').remote;
    var window = remote.getCurrentWindow();
    window.close();
}

function loadRSS() {
    //RSS取得
    document.getElementById('rss').innerHTML = ""
    if (localStorage.getItem('rss') != null || localStorage.getItem('rss_check') != "false") {
        client.fetch(localStorage.getItem('rss'))
            .then((result) => {

                var linkList = [];
                var titleList = [];

                result.$('link').each(function (idx) {
                    linkList.push(result.$(this).text())
                });

                result.$('title').each(function (idx) {
                    titleList.push(result.$(this).text())
                });

                //先頭のタイトル消す
                titleList.shift()

                for (var i = 0; i < linkList.length; i++) {
                    var ptag = `<p><a onclick='openBrowser("${linkList[i + 1]}")'>${titleList[i]}</a></p>`
                    console.log(ptag)
                    document.getElementById('rss').innerHTML += ptag
                }

            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                console.log('終了');
            });
    }
}

function openBrowser(link) {
    //ブラウザ起動
    const shell = require('electron').shell;
    shell.openExternal(link)
}

function settingOpen() {
    const { app, BrowserWindow, Menu } = require('electron').remote
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 600,         //横
        height: 400,        //縦
        icon: "./src/icon.ico",//アイコン
        webPreferences: {
            nodeIntegration: true   //これ書く。
        }
    })
    // and load the index.html of the app.
    mainWindow.loadFile('./src/setting.html')
    //メニューバー削除
    Menu.setApplicationMenu(null)

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}