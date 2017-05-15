var keyCol = new Array();
keyCol[1] = "234567890-";
keyCol[2] = "QWERTYUIOP[";
keyCol[3] = "ASDFGHJKL;'";
keyCol[4] = "ZXCVBNM,./";
var black_key = "48WEYUP[AFGKLCM";
var keyMap = new Map();

window.onload = function() {
    init();
}

function init() {
    for (var i = 1; i < 5; i++) {
        var temp = document.getElementById("key" + i);
        for (var j = 0; j < keyCol[i].length; j++) {
            var tempDiv = document.createElement("div");
            var tempSpan = document.createElement("span");
            temp.appendChild(tempDiv);
            keyMap[keyCol[i][j]] = tempDiv;
            tempDiv.appendChild(tempSpan);
            tempSpan.innerHTML = keyCol[i][j];
            tempSpan.setAttribute("class", "keyNum")
            tempDiv.setAttribute("class", "key");
            if (black_key.indexOf(keyCol[i][j]) >= 0)
                tempDiv.setAttribute("class", "key deep-gray");
            else
                tempDiv.setAttribute("class", "key gray")
        }
    }
}

function keyUp(e) {
    var keycode = event.keyCode;
    var realkey = getkeyValue(keycode);
    var tempDiv = keyMap[realkey];
    if (tempDiv != undefined) {
        if (black_key.indexOf(realkey) >= 0)
            tempDiv.setAttribute("class", "key deep-gray");
        else
            tempDiv.setAttribute("class", "key gray")
    }
}

function keyDown(e) {
    var keycode = event.keyCode;
    var realkey = getkeyValue(keycode);
    var tempDiv = keyMap[realkey];
    if (tempDiv != undefined)
        tempDiv.setAttribute("class", "key green");
}

document.onkeydown = keyDown;
document.onkeyup = keyUp;

function getkeyValue(keycode) {
    var realkey;
    switch(keycode) {
        case 189: realkey = "-"; break;
        case 209: realkey = "["; break;
        case 186: realkey = ";"; break;
        case 222: realkey = "'"; break;
        case 188: realkey = ","; break;
        case 190: realkey = "."; break;
        case 191: realkey = "/"; break;
        default: realkey = String.fromCharCode(event.keyCode);
    }
    return realkey;
}