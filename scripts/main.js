/*global window: true */
var $ = require('zquery');
var fullbrows = require('fullbrows');

var apps = {
    timelog: require('timelog').main,
    combigame: fullbrows.startFn(require('combigame').app),
    bidiv: fullbrows.startFn(require('bidiv').app),
    plasma: fullbrows.startFn(require('demoPlasma').app),
    'source/': function(name) { require('showSource').show(name); },
    'notes/': notes,
    menu: menuFn,
    'default': function() {
        console.log('default dispatch');
    }
};

function dispatch() {
    var param = window.location.hash.slice(1);
    for(var name in apps) {
        if(param.slice(0,name.length) === name) {
            param = param.slice(name.length);
            break;
        }
    }
    console.log('name:', name, 'param:', param);
    apps[name](param);
}

exports.main = function() { $(function() {
    window.onhashchange = dispatch;
    dispatch();
});};

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

function notes(fnname) {
    var showdown;
    showdown = require('showdown');
    showdown = new showdown.converter();
    console.log(showdown);
    $.get('notes/' + fnname + '.md', function(text) {
        var html = showdown.makeHtml(text);
        fullbrows.start({type: 'scrollable', update: function() {
            $('#content').html(html);
        }});
    });
}

function menuFn() {
    fullbrows.start({update: function() {
        fullbrows.start(require('./menu').createApp(menuXml));
    }});
}

var menuXml = ["ul",
    ["li","solsort.dk",["ul",
        ["li",["a",{"href":"/CurriculumVitae.html"},"CV"]],
        ["li","Apps",["ul",
            ["li",["a",{"href":"/dkcities"},"Danskebyer"]],
            ["li",["a",{"href":"/notescore"},"notescore"]],
            ["li",["a",{"href":"/planetcute"},"PlanetCute"]]]],
        ["li","Notes",["ul",
            ["li",["a",{"href":"/notes/tekststruktur-for-rapporter.html"},"Tekststruktur for rapporter"]],
            ["li",["a",{"href":"/notes/tommelfingerregler-for-skrivning.html"},"Tommelfingerregler for skrivning"]],
            ["li",["a",{"href":"/notes/fototips.html"},"Fototips"]],
            ["li","Tech",["ul",
                ["li",["a",{"href":"/notes/tech/c9ender.html"},"Cloud9 and Ender"]],
                ["li",["a",{"href":"/notes/tech/jekyll.html"},"Jekyll / github-pages"]],
                ["li",["a",{"href":"/notes/tech/vim.html"},"vim"]],
                ["li",["a",{"href":"/notes/tech/coffee.html"},"CoffeeScript"]]]],
            ["li",["a",{"href":"/notes/ted.html"},"TED talks"]]]],
        ["li","JS",["ul",
            ["li",["a",{"href":"/devintro/book.html"},"devintro"]],
            ["li","1k",["ul",
                ["li",["a",{"href":"/f1k/blah.html"},"4d juliabrot"]],
                ["li",["a",{"href":"/f1k/rain.html"},"rain"]]]],
            ["li","tweetsize",["ul",
                ["li",["a",{"href":"/f1k/brown.html"},"brownian motion"]],
                ["li",["a",{"href":"/f1k/sierpinsky.html"},"sierpinsky"]]]],
            ["li","“iOS style”:"],["li","“hierachical layout”:"],
            ["li","“slidein transitions”:"]]],
        ["li","Presentations",["ul",
            ["li",["a",{"href":"/presentations/oauth2.html"},"OAuth2"]]]]]]];
