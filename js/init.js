var keyCol = new Array();
keyCol[1] = "234567890-";
keyCol[2] = "QWERTYUIOP[";
keyCol[3] = "ASDFGHJKL;'";
keyCol[4] = "ZXCVBNM,./";
var black_key = "48WEYUP[AFGKLCM";

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
