/*global window: true */
var $ = require('zquery');
var fullbrows = require('fullbrows');

var notes = {
    type: 'scrollable',
    start: function() {
        var showdown;
        showdown = require('showdown');
        showdown = new showdown.converter();
        var app = this;
        $.get('notes/' + this.param + '.md', function(text) {
            var html = showdown.makeHtml(text);
            app.$.html(html);
        });
    }
};
$('head').append('<style>' +
        '@font-face { font-family: Ubuntu; src: url("img/Ubuntu-R.ttf"); }' +
        '@font-face { font-family: sans-serif; src: url("img/Ubuntu-R.ttf"); }' +
        '@font-face { font-family: "Ubuntu Mono"; src: url("img/UbuntuMono-R.ttf"); }' +
        '@font-face { font-family: "Ubuntu Condensed"; src: url("img/Ubuntu-C.ttf"); }' +
        'tt { font-family: "Ubuntu Mono", monospace; }' +
        'code { font-family: "Ubuntu Mono", monospace; }' +
        'pre { font-family: "Ubuntu Mono", monospace; }' +
        'body { font-family: Ubuntu, sans-serif; }</style>');

var menuXml = ["ul",
    ["li","solsort",["ul",
        ["li",["a",{"href":"#rasmuserik"},"Rasmus Erik"]],
        ["li","Apps",["ul",
            ["li",["a",{"href":"#dkcities"},"Danske Byer"]],
            ["li",["a",{"href":"#notescore"},"Note\xadScore"]],
            ["li",["a",{"href":"#planetcute"},"Planet\xadCute"]],
            ["li",["a",{"href":"#combigame"},"Combi\xadgame"]]]],
        ["li","Notes",["ul",
            ["li",["a",{"href":"#notes/tekststruktur-for-rapporter"},"Tekst\xadstruktur for rapporter"]],
            ["li",["a",{"href":"#notes/tommelfingerregler-for-skrivning"},"Tommel\xadfinger\xadregler for skrivning"]],
            ["li",["a",{"href":"#notes/fototips"},"Foto\xadtips"]],
            ["li",["a",{"href":"#notes/speak-eval"},"Evalu\xadering af taler"]]]],
        ["li","Images",["ul" ]],
        ["li","Code Demos",["ul",
            ["li",["a",{"href":"#plasma"},"Diamond-square plasma generation"]],
            ["li",["a",{"href":"#js1k/sierp"},"Tweetsize Sierpinsky tri\xadangle"]],
            ["li",["a",{"href":"#js1k/brown"},"Tweetsize brownian noise animation"]],
            ["li",["a",{"href":"#js1k/rain"},"Rain\xaddrops on water simulation"]],
            ["li",["a",{"href":"#js1k/julia4d"},"Projection of 4d-julia\xadbrot fractal"]],
            ]]
    ]]];


var currentName = '';

function dispatch() {
    var param = window.location.hash.slice(1);
    for(var name in apps) {
        if(param.slice(0,name.length) === name) {
            param = param.slice(name.length);
            break;
        }
    }
    console.log('name:', name, 'param:', param);
    console.log(apps[name]);
    apps[name].param = param;
    fullbrows.start(apps[name]);
}

exports.main = function() { $(function() {
    window.onhashchange = dispatch;
    dispatch();
});};

exports.switchTo = function(name, param) {
    if(!name) {
        name = currentName;
    }
    window.location.hash = name + param;
};

function unicodeTest() {
    var t = [];
    var i;
    var n = 65538;
    $('body').text('');
    for(i=0;i<n;++i) {
        t.push(i);
    }
    t = t.map(function(a) { return String.fromCharCode(a); });
    t = t.join('');
    for(i=0;i<n;++i) {
        if(t.charCodeAt(i) !== i) {
            $('body').append('error t[' + i + '] -> ' + t.charCodeAt(i) + '<br>');
        }
    }
    $('body').append('done');
}

var apps = {
    combigame: require('combigame').app,
    bidiv: require('bidiv').app,
    notescore: require('notescore').app,
    plasma: require('demoPlasma').app,
    'source/': require('showSource').app,
    timelog: require('timelog').app,
    'js1k/': require('js1k').app,
    'notes/': notes,
    menu: require('./menu').createApp(menuXml),
    'default': {start: function () { }}
};
