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
    var lbar = $(window).width() > $(window).height();
    var barsize = app.mobile?8:8;
    $('#bar').css({
        //boxShadow: '3px 3px 9px rgba(0, 0, 0, .4)',
        //webkitBoxShadow: '3px 3px 9px rgba(0, 0, 0, .4)',
        position: 'absolute',
        left: '0px',
        top: '0px',
        margin: 0,
        padding: 0,
        textAlign: 'center',
        overflow: 'visible',
        //background: 'rgba(221,221,221,.9)',
        width: lbar?barsize+'%':'100%',
        height: lbar?'100%':barsize+'%'
    }).html('<img class="barleft" src="img/help.png"> <img class="barleft" src="img/difficulty.png"> <img class="barright" src="img/score.png">');
    var iconsize = lbar ? $('#bar').width() : $('#bar').height();
    $('#bar img').css(({
        width: iconsize * 0.6,
        height: iconsize * 0.6,
        boxShadow: '3px 3px 9px rgba(0, 0, 0, .4)',
        webkitBoxShadow: '3px 3px 9px rgba(0, 0, 0, .4)',
        background: 'rgba(255,255,255,.9)',
        verticalAlign: 'top',
        padding: iconsize * 0.1,
        border: '1px solid black',
        borderRadius: iconsize*0.2,
        marginLeft: iconsize * 0.1,
        marginBottom: iconsize *0.1,
        marginRight: iconsize *0.1,
        marginTop: iconsize * 0.1}));
    $('#bar').css('position', 'fixed');

    $('.barleft').css('float', 'left');
    $('.barright').css('float', 'right');
        
    $('#content')
        .css('position', 'absolute')
        .css('left', lbar?barsize+'%':0)
        .css('top', lbar?1:barsize+'%')
        .css('overflow', 'hidden')
        .css('width', lbar?(100-barsize)+'%':'100%')
        //.css('margin-top', 1)
        .css('padding-bottom', 1)
        .css('height', (app.type === 'scrollable') ? 'auto' : lbar?'100%':(100-barsize)+'%');
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

    app.start = app.start || app.update;
    relayoutStyle();
    app.start();
};

exports.startFn = function(app) { console.log(1); return function() { console.log(2);exports.start(app); } ; };
