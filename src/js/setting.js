window.onload = function () {
    //表示したら読み込む
    this.load()
}


function save() {
    //保存する
    var rss = document.getElementById('rss').value
    var rssCheck = document.getElementById('rss_check').checked
    var ssid = document.getElementById('ssid').value
    localStorage.setItem('rss', rss)
    localStorage.setItem('rss_check', rssCheck)
    localStorage.setItem('ssid', ssid)
}

function load() {
    //読み込む
    document.getElementById('rss').value = loadLocalStorage('rss', '')
    document.getElementById('rss_check').checked = toBoolean(loadLocalStorage('rss_check', 'false'))
    document.getElementById('ssid').value = loadLocalStorage('ssid', '')
}

function loadLocalStorage(name, def) {
    if (localStorage.getItem(name) != null) {
        return localStorage.getItem(name)
    } else {
        return def
    }
}

function toBoolean(data) {
    if (data == "true") {
        return true
    } else {
        return false
    }
}