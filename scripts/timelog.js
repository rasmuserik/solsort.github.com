/*global window: true*/
//var window = require('window');
var storage = window.localStorage;
var $ = require('zquery');
var _ = require('underscore');
var util = require('util');
var webutil = require('webutil');
var fullbrows = require('fullbrows');

var timelog;
var recentLength = 30*24*60*60*1000;


function callbackFn(name) {
    return function() {
        console.log(name);
        setCurrent(name);
    };
}
// ## Render timelog ui
function drawTaskButtons($target, x0, y0, w, h, spacing) {
    console.log(w,h);
    var tasks = getTaskList(24);
    var current = getCurrent();
    spacing >>= 1;

    for(var i = 0; i < tasks.length; ++i) {
        var $button = $('<div>');
        var text = tasks[i];
        var pad = spacing >>1;
        $button.text(text)
            .css({
                margin:0,
                width: w,
                height: h,
                position: 'absolute',
                borderRadius: spacing>>1,
                backgroundColor: util.colorHash(text),
                padding:0});
        console.log($button[0]);

        $target.append($button);
        webutil.scaleText($button);
        $button.css({display: 'inline-block',
                verticalAlign: 'middle',
                padding: pad,
                margin: (spacing>>1),
                width: w+'px',
                position: 'relative'});

        if(text === current) {
            $button.css('boxShadow', 'inset 3px 3px 9px rgba(0, 0, 0, .8)');
        } else {
            $button.css('boxShadow', '3px 3px 9px rgba(0, 0, 0, .8)');
            $button.bind('touchstart mousedown click', callbackFn(text));
        }
    }
    /*
    var buttonWidth = (w-spacing*5)/4|0;
    var buttonHeight = (h-spacing*6)/5|0;
    var pad = Math.min(buttonHeight,buttonWidth) >> 3;
    for(var x = 0; x < 4; ++x) {
        for(var y = 0; y < 5; ++y) {
            var $button = $('<div>');
            var text = tasks[x+y*4];
            var left =  x0 + x * (buttonWidth + spacing)+spacing;
            var top = y0 + y * (buttonHeight + spacing)+spacing;
            $button.text(text)
            .css({
                top: top,
                left: left,
                borderRadius: spacing>>1,
                backgroundColor: util.colorHash(text)
                })
            .width(buttonWidth - 2*pad)
            .height(buttonHeight - 2*pad);

            $target.append($button);
            webutil.scaleText($button);
            $button.css({
                'position': 'absolute',
                padding: pad
                });
            console.log(text, current);
            if(text === current) {
                $button.css('boxShadow', 'inset 3px 3px 9px rgba(0, 0, 0, .8)');
            } else {
                $button.css('boxShadow', '3px 3px 9px rgba(0, 0, 0, .8)');
                $button.bind('touchstart mousedown click', callbackFn(text));
            }
        }
    }

    for(var i = 0; i < tasks.length; ++i) {
    }
    */
}
function renderUI() {
    var $content = $('#content');
    $content
        .html('')
        .css({
            textAlign: 'center',
            backgroundColor: 'white'
            });
    drawTaskButtons($content, 0, 0, $(window).width()/6, $(window).height()/10, $(window).width()/40);

    var usageObj= usage();
    var report = [];
    for(var key in usageObj) {
        report.push(usageObj[key]);
    }
    report = report.reverse();
    $('body').append($('<pre>').text(JSON.stringify(report, undefined, '  ')));

}

// ## Utility functions for accessing the timelog data structure
/** Set current task */
function setCurrent(name, id) {
    id = id || Date.now();
    console.log('setCurrent', name, id);
    var elem = {id: id, value: name};
    timelog.changes[id] = elem;
    addEntry(elem);
    sync();
    renderUI();
}

/** Get the list of n most recent tasks, ordered by latest appearance */
function getTaskList(n) {
    var entries = _(timelog.tasks)
            .values()
            .sort(function(a,b) { return b.latest - a.latest; })
            .slice(0, n);
    var result = [];
    entries = entries.sort(function(a,b) { return b.earliest - a.earliest; });
    return _(entries).pluck('value');
}

/** Get name of current task */
function getCurrent() {
    try {
        return timelog.recentLog[Math.max.apply(undefined, Object.keys(timelog.recentLog).map(function(e) { return +e; }))].value;
    } catch(e) {
        return 'undefined';
    }
}
/** Get time usage */
function usage() {
    var times = Object.keys(timelog.recentLog).map(function(e) { return +e; }).sort();
    var days = {};
    var prev = timelog.recentLog[times[0]];
    times.forEach(function(time) {
            var day = ((+time) / (24*60*60*1000)) | 0;
            day = days[day] = days[day] || {};
            var current = timelog.recentLog[time];
            day[prev.value] = (day[prev.value] || 0) + (current.id - prev.id)/60/60/1000;
            prev = current;
    });
    return days;
}

// ## Localstorage
/** Write timelog to localstorage */
function save() {
    var now = Date.now();
    var recentLog = {};
    Object.keys(timelog.recentLog).filter(function(key) {
            return +key > now-recentLength;
    }).forEach(function (key) {
        recentLog[key] = timelog.recentLog[key];
    });
    timelog.recentLog = recentLog;

    storage.setItem('timelog', JSON.stringify(timelog));
    exports.timelog = timelog;
}

/** Load timelog from localstorage */
function load() {
    timelog = JSON.parse(storage.getItem('timelog') || 'false');
    console.log('timelog:', timelog);
    if(!timelog) {
        var accountName = window.prompt('Please enter a name/passphrase for your timelog timelog.account. This should be a globally uniq secret name only you should know. Anybody knowing the name can acces the timelog timelog.account. If the name does not exist already, a new timelog will be created');
        if(!accountName) {
            return;
        }
        timelog = {
            account: accountName,
            lastTime: 0,
            recentLog: {},
            tasks: {},
            changes: {}
        };
    }
}

// ## Synchronisation with central server
/**
 * Add an entry to the timelog, - this is both used for synchronisation, and
 * also when creating a new event.
 */
function addEntry(elem) {
    timelog.recentLog[elem.id] = elem;
    var task = timelog.tasks[elem.value] || {value: elem.value, earliest: elem.id, latest: 0};
    task.latest = Math.max(task.latest, elem.id);
    timelog.tasks[elem.value] = task;
}

/** Callback function, for answers from server */
function syncCallback(eventArr) {
    if(eventArr.error) {
        delete timelog.changes[eventArr.id];
        return;
    }
    eventArr.forEach(function(elem) {
        timelog.lastTime = Math.max(timelog.lastTime, elem.timestamp);
        addEntry(elem);
        if(timelog.changes[elem.id]) {
            delete timelog.changes[elem.id];
        }
    });
    if(eventArr.length === 1000 || Object.keys(timelog.changes).length > 0) {
        sync();
    }
    save();
    renderUI();
}

/** Synchronisation with server */
function sync() {
    var elem = false;
    if(Object.keys(timelog.changes).length > 0) {
        elem = timelog.changes[Object.keys(timelog.changes)[0]];
    }

    // HACK: hardcoded url, as it only has one webservice-server
    var url = 'https://rasmuserik-timelog.appspot.com/?' +
        'name=' + timelog.account +
        '&since=' + timelog.lastTime;
    if(elem) {
        url += '&id=' + elem.id + '&value=' + window.escape(elem.value);
    }
    url +='&callback=?';
    $.ajax({url: url, success: syncCallback});
}

exports.sync = sync;

// # Main
/** main function */
exports.app = {
    type: 'scrollable',
    start: function() {
        load();
        sync();
        console.log(getTaskList(16));
        console.log(getCurrent());
        console.log(usage());
        this.update();
    },
    update: renderUI
};
