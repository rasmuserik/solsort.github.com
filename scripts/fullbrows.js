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
    var barsize = app.mobile?10:8;
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
        border: iconsize * 0.02 +'px solid #000',
        verticalAlign: 'top',
        textAlign: 'center',
        fontFamily: 'Ubuntu Condensed',
        padding: iconsize * 0.1,
        borderRadius: iconsize*0.2,
        marginLeft: iconsize * 0.1,
        marginBottom: iconsize *0.1,
        marginRight: iconsize *0.1,
        marginTop: iconsize * 0.1};
    $('#bar img').css(barItemStyle);

    require('webutil').scaleText($('#bar span'));
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
        .css('overflow', 'visible')
        .css('width', vbar?(100-barsize)+'%':'100%')
        //.css('margin-top', 1)
        .css('padding-bottom', 1)
        .css('height', (app.type === 'scrollable') ? 'auto' : vbar?'100%':(100-barsize)+'%');
    window.scrollTo(0,1);
}
exports.addButton = addButton;
function addButton(obj) {
    var pos = (obj.pos==='right')?'#barright':'#barleft';

    var button;
    if(obj.imagePath) {
        button = $('<img src="' + obj.imagePath + '">');
    } else {
        button = $('<span>').text(obj.text);
    }
    $(pos).append(button);
    if(obj.id) {
        button.attr('id', obj.id);
    }
    console.log(button);
    try {
    button.on('mousedown touchstart', function(e) {
        if(typeof obj.callback === 'function') {
            obj.callback();
        }
        e.preventDefault();
        return false;
    });
    } catch(e) {
    }
    relayoutStyle();
}

function relayout() {
    if(typeof app.update === 'function') {
        app.update();
    }
    relayoutStyle();
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
    if(!app.hideButtons) {
        addButton({imagePath: 'img/home.png', pos: 'right', callback: function() {
            window.location.hash = '';
        }});
        if(window.location.hash.slice(0,7) === '#source') {
            addButton({text: 'run', id: 'sourcebutton', pos: 'right', callback: function() {
                window.location.hash = '#' + window.location.hash.slice(8);
            }});
        } else {
            addButton({text: 'code', id: 'sourcebutton', pos: 'right', callback: function() {
                window.location.hash = "#source/" + window.location.hash.slice(1);
            }});
        }
    } else {
        relayoutStyle();
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
    app.start();
    relayoutStyle();
};

exports.startFn = function(app) { console.log(1); return function() { console.log(2);exports.start(app); } ; };
