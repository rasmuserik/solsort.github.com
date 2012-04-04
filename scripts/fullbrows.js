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
var relayoutFn;
var app = {};
function relayout() {
    $('#content')
        .css('position', 'absolute')
        .css('left', 0)
        .css('top', 1)
        .css('overflow', 'hidden')
        .css('font-family', 'sans-serif')
        .css('width', '100%')
        .css('height', (app.type === 'scrollable') ? 'auto' : webutil.windowHeight());
    if(typeof relayoutFn === 'function') {
        relayoutFn(window.document.getElementById('content'));
    }
    window.scrollTo(0,1);
}
var relayoutDelayed = util.niceSingle(relayout);

exports.start = function(opt) {
    if(typeof app.stop === 'function') {
        app.stop();
    }
    app = opt || {};
    app.type = app.type || 'fullscreen';
    $('#content').remove();
    if(app.type === 'canvas') {
        console.log('a');
        $('body').append('<canvas id="content">Error: canvas not supported, please update to a modern browser.</canvas>');
    } else {
        console.log('b');
        $('body').append('<div id="content"></div>');
    }
    app.$ = $('#content');
    app.elem = app.$[0];
    /*
    if(!window.document.getElementById('content')) {
        $('body').append('<div id="content"></div>');
    }
    */
    if(!Modernizr.touch) {
        if(app.type === 'scrollable') {
            $('body').css('overflow', 'auto');
        } else {
            $('body').css('overflow', 'hidden');
        }
    } else {
        $('#addressbarfillerdisable').remove();
        //if($('#addressbarfillerdisable').length === 0) {
            $('body').append('<div id="addressbarfillerdisable" style="height:' +
                (Math.max(webutil.windowHeight(),$(window).width()) + 62) +
                'px;"></div>');
        //}
    }
    $(window).bind('resize', relayoutDelayed);
    $(window).bind('orientationchange', relayoutDelayed);
    relayoutFn = app.start || app.update;
    relayout();
    relayoutFn = app.update;
};

exports.startFn = function(app) { console.log(1); return function() { console.log(2);exports.start(app); } ; };
