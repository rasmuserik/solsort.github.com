// imports
var util = require('util');
var webutil = require('webutil');
var $ = require('zquery');
var window = require('window');
var Modernizr = require('modernizr');

// # Fullbrows is an api for full-screen browser apps
//
// An app consist is an object with the following values:
//
// - start()
// - update()
// - stop()
// - type: fullscreen | scrollable | canvas
// - package

// # Browser window setup
var app = {};

function l(e) {
    console.log(e);
    return e;
}
function relayoutStyle() {
    var vbar = $(window).width() > $(window).height();
    var barsize = app.mobile?12:8;
    $('#bar').css({
        position: 'fixed',
        left: vbar?100-barsize+'%' : '0px',
        top: '0px',
        margin: 0,
        padding: 0,
        overflow: 'visible',
        width: vbar?barsize+'%':'100%',
        height: vbar?'100%':barsize+'%'
    });
    var iconsize = vbar ? $('#bar').width() : $('#bar').height();

    var barItemStyle = {
        width: iconsize * 0.6,
        height: iconsize * 0.6,
        '-webkit-box-shadow': '0px 0px 32px rgba(255, 255, 255, 1), 2px 2px 14px rgba(0, 0, 0, .7)',
        '-moz-box-shadow': '0px 0px 32px rgba(255, 255, 255, 1), 2px 2px 14px rgba(0, 0, 0, .7)',
        '-o-box-shadow': '0px 0px 32px rgba(255, 255, 255, 1), 2px 2px 14px rgba(0, 0, 0, .7)',
        'box-shadow': '0px 0px 32px rgba(255, 255, 255, 1), 2px 2px 14px rgba(0, 0, 0, .7)',
        background: 'rgba(255,255,255,1)',
        verticalAlign: 'top',
        padding: iconsize * 0.1,
        borderRadius: iconsize*0.2,
        marginLeft: iconsize * 0.1,
        marginBottom: iconsize *0.1,
        marginRight: iconsize *0.1,
        marginTop: iconsize * 0.1};
    $('#bar img').css(barItemStyle);
    $('#bar span').css(barItemStyle);

    $('#barleft img').css('float', 'left');
    $('#barleft span').css('float', 'left');
    $('#barright img').css('float', 'right');
    $('#barright span').css('float', 'right');

    if(vbar) {
        $('#barright').css({
            width: iconsize,
            position: 'fixed',
        });
        $('#barright').css({
            position: 'fixed',
            top: $('#bar').height() - $('#barright').height()
        });
    } else {
        $('#barright').css({
            position: 'static',
            width: 'auto',
            top: 'auto'
        });
    }
        
    if(app.underbar) {
        barsize = 0;
        vbar = true;
    }
    $('#content')
        .css('position', 'absolute')
        .css('left', 0 /*vbar?barsize+'%':0*/)
        .css('top', vbar?1:barsize+'%')
        .css('overflow', 'hidden')
        .css('width', vbar?(100-barsize)+'%':'100%')
        //.css('margin-top', 1)
        .css('padding-bottom', 1)
        .css('height', (app.type === 'scrollable') ? 'auto' : vbar?'100%':(100-barsize)+'%');
    window.scrollTo(0,1);
}
function relayout() {
    relayoutStyle();
    if(typeof app.update === 'function') {
        app.update();
    }
    window.scrollTo(0,1);
}
var relayoutDelayed = util.niceSingle(relayout);
var isMobile = window.isMobile || !!window.navigator.userAgent.match(/mobile/i);

exports.start = function(opt) {
    if(typeof app.stop === 'function') {
        app.stop();
    }
    app = opt || {};
    app.type = app.type || 'fullscreen';
    if(app.mobile === undefined) {
        app.mobile = isMobile;
    }

    $('#content').remove();
    if(app.type === 'canvas') {
        $('body').append('<canvas id="content">Error: canvas not supported, please update to a modern browser.</canvas>');
    } else {
        $('body').append('<div id="content"></div>');
    }
    $('#bar').remove();
    $('body').append('<div id="bar"></div>');
    $('#bar').html('<div id="barleft"></div><div id="barright"></div>');
    //<img src="img/help.png"> <img src="img/difficulty.png"></div> <div id="barright"><img src="img/give-up.png"><img src="img/score.png"></div>');
    $('#barleft').append($('<img src="img/home.png">').on('mousedown touchstart', function(e) {
        window.location.hash = '';
        e.preventDefault();
        return false;
    }));
    if(window.location.hash.slice(0,7) === '#source') {
        $('#barleft').append($('<img id="sourcebutton" src="img/sourcecode.png">').on('mousedown touchstart', function(e) {
            window.location.hash = '#' + window.location.hash.slice(8);
            e.preventDefault();
            return false;
        }));
    } else {
        $('#barleft').append($('<img id="sourcebutton" src="img/sourcecode.png">').on('mousedown touchstart', function(e) {
            window.location.hash = "#source/" + window.location.hash.slice(1);
            e.preventDefault();
            return false;
        }));
    }

    app.$ = $('#content');
    app.elem = app.$[0];
    if(!Modernizr.touch) {
        if(app.type === 'scrollable') {
            $('body').css('overflow', 'auto');
        } else {
            $('body').css('overflow', 'hidden');
        }
    } else {
        $('#addressbarfillerdisable').remove();
        $('body').append('<div id="addressbarfillerdisable" style="height:' +
            (Math.max(webutil.windowHeight(),$(window).width()) + 62) +
            'px;"></div>');
    }
    $(window).bind('resize', relayoutDelayed);
    $(window).bind('orientationchange', relayoutDelayed);

    $('body').css({
            webkitTransition: 'background 1s',
            transition: 'background 1s',
            'background': '#fff'
    });
    app.start = app.start || app.update;
    relayoutStyle();
    app.start();
};

exports.startFn = function(app) { console.log(1); return function() { console.log(2);exports.start(app); } ; };
