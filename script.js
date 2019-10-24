/*jshint esversion: 6*/


// NOTE - All in GMT!
var downtimeHour = 15;
var upTimeHour = 23;
var downtimeMinute = 0;
var uptimeMinute = 0;

const inTrans = "all 250ms ease";
const inTransHeight = 4;


function failedConnect(response) {
    if (!response.ok) {
        if (getData != 8) {
            getData();
            getDataLoop++;
        } else {
            throw Error(response.statusText);
        }
    }

    return response.text();
}

if (!isDownTime()) {
    getData();
} else {
    
    loadInObj("widgetArea");
    loadInObj("hsscArea");

    document.getElementById("widgetArea").style.height = "250px";
    var downtime = document.getElementById("downtime");
    downtime.style.display = "block";
    downtime.style.opacity = "1";
    document.getElementById("wordArea").style.display = "none";
}

var getDataLoop = 0;

function getData() {
    fetch('https://word-of-the-day-hssc.herokuapp.com/', {
            mode: "cors"
        })
        .then(failedConnect)
        .then(function (response) {

            if (response != null && response != "") {
                loadData(response);
            } else {

                console.log("Regetting data");

                if (getDataLoop != 8) {
                    getData();
                } else {

                    showError();
                }
            }
        }).catch(function(error) {
            showError();
        });
}

function showError() {
    loadInObj("widgetArea");
    document.getElementById("widgetArea").style.height = "250px";

    var downtime = document.getElementById("downtime");
    downtime.style.display = "block";
    downtime.style.opacity = "1";
    document.getElementById("wordArea").style.display = "none";
    document.getElementById("downtimeText").innerHTML = "The widget is currently down for maintenance. Please check back later.";

    loadInObj("hsscArea");
}


function isDownTime() {
    var date = new Date();

    var downTime = downtimeHour * 60 + downtimeMinute;
    var upTime = upTimeHour * 60 + uptimeMinute;

    var timeNow = date.getUTCHours() * 60 + date.getUTCMinutes();

    return downTime <= timeNow && timeNow < upTime;
}

function getHeight() {
    var widgetArea = document.getElementById("widgetArea");
    var hsscArea = document.getElementById("hsscArea");

    return widgetArea.offsetHeight.valueOf() + hsscArea.offsetHeight.valueOf();
}

function loadData(response) {

    var wordInfo = response.split(",,,,,");

    var word = wordInfo[0];
    var type = wordInfo[1];
    var pronounciation = wordInfo[2];
    var definition = wordInfo[3];


    var widgetArea = document.getElementById("widgetArea");
    widgetArea.style.opacity = "1";

    setText("word", word);
    setText("wordType", type);
    setText("pronounciation", pronounciation);
    setText("definition", definition);

    
    var widgetHeight =  (widgetArea.offsetHeight.valueOf() - 12) + "px";
    widgetArea.style.minHeight = widgetHeight;
    widgetArea.style.maxHeight = widgetHeight;

    setTimeout(function() {
        loadInObj("word", word);
        loadInObj("hsscArea");
    }, 100);

    setTimeout(function() {
        loadInObj("wordType", type);
        loadInObj("separatorDot");
        loadInObj("pronounciation", pronounciation);
    }, 200);

    setTimeout(function() {
        loadInObj("middleSeparator");
    }, 300);

    setTimeout(function() {
        loadInObj("definition", definition);
    }, 400);

    setTimeout(function() {
        loadInObj("bottom");
    }, 500);

}

function setText(id, str) {
    var obj = document.getElementById(id);

    const margin = obj.style.marginTop;

    obj.innerHTML = str;
}

function loadInObj(id) {

    var obj = document.getElementById(id);

    const margin = obj.style.marginTop;

    obj.style.transition = "";
    obj.style.opacity = "0";
    obj.style.marginTop = obj.style.marginTop - inTransHeight + "px";

    setTimeout(function() {
        obj.style.transition = inTrans;

        obj.style.opacity = "1";
        obj.style.marginTop = margin;
    }, 100);
}

function loadOutObj(id) {

    var obj = document.getElementById(id);

    const margin = obj.style.marginTop;

    obj.style.opacity = "0";
    obj.style.marginTop = obj.style.marginTop - inTransHeight + "px";

    setTimeout(() => {
        obj.style.marginTop = margin;
    }, 100);
}

var infoArea = document.getElementById("infoArea");

// get link

var link = "https://raw.githubusercontent.com/CAG2-Mark/Word-of-the-day-Client/master/infoLink.txt";
var defaultText = "DEFAULT";
var infoLink = "";

fetch(link, {mode: "cors"})
.then(failedConnect)
.then(function (response) {

    if (response != null && response != "") {

        infoLink = response;
    } else {
        infoLink = defaultText;
    }

}).catch(function(error) {
    infoLink = defaultText;
});


function showInfo() {
    
    if (infoLink.startsWith(defaultText)) {

        //infoArea.style.display = "block";
        //infoArea.style.height = getHeight() + "px";

        //loadInObj("infoArea");

        var win = window.open("https://drive.google.com/file/d/1J92aTAvtYRbyVlNZrvSUIckW2RI2rOUH/view", '_blank');
        win.focus();
    }
    else {
        var win = window.open(infoLink, '_blank');
        win.focus();
    }
}

function hideInfo() {
    loadOutObj("infoArea");

    setTimeout(() => {
        infoArea.style.display = "none";
    }, 100);
}