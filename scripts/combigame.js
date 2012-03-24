/*global alert: true*/
var cardSprites;
var $ = require('zquery');
var _ = require('underscore');
var Modernizr = require('modernizr');

var hidden = {
    opacity: 0,
    width: 0,
    height: 0
};

var transitionStyle = {
    'transition': 'opacity 2s',
    '-moz-transition': 'opacity 2s',
    '-webkit-transition': 'opacity 2s',
    '-o-transition': 'opacity 2s'
};

var visibleStyle;
var selectedStyle;
var unselectedStyle;
var pos;
var size;
var doLayout = function() {
    var $content = $('#content');
    $content.css('background', 'white');
    var w = $content.width();
    var h = $content.height();
    var topPad, leftPad;
    var landscape = true;
    var i, x, y;

    pos = [];
    size = Math.min(Math.max(w,h)/4, Math.min(w,h)/3);

    if(w > h) {
        topPad = (h - size * 3) >> 1;
        leftPad = (w - size * 4) >> 1;
    } else {
        topPad = (h - size * 4) >> 1;
        leftPad = (w - size * 3) >> 1;
        landscape = false;
    }
    topPad += 0.05*size;
    leftPad += 0.05*size;

    for(x = 0; x < 3; ++x) {
        for(y = 0; y < 3; ++y) {
            pos.push({
                top: topPad + (0.5 + y) * size,
                left: leftPad + (0.5 + x) * size
            });
        }
    }
    for(i = 0; i < 3; ++i) {
        if(landscape) {
            pos.push({
                top: topPad + (0.5 + i) * size,
                left: leftPad + (0.5 + 3) * size
            });
        } else {
            pos.push({
                top: topPad + (0.5 + 3) * size,
                left: leftPad + (0.5 + i) * size
            });
        }
    }

    visibleStyle = {
        opacity: 1,
        'margin-top': -size/2,
        'margin-left': -size/2,
        width: 0.9*size,
        height: 0.9*size
    };
    selectedStyle = {
        'border-style': 'solid',
        'border-width': 1,
        'margin-top': -size/2 - 1,
        'margin-left': -size/2 - 1,
        'border-radius': size/16,
        'border-color': 'gray'
    };
    unselectedStyle = {
        'margin-top': -size/2,
        'margin-left': -size/2,
        border: 'none'
    };

    if(!cardSprites) {
    }
    $('#timer').css({
            'font-size': w / 3,
            'color': '#eeeeee',
            position: 'absolute',
            'text-align': 'center',
            'width': '100%'
            })
        .css('top', (h-$('#timer').height())/2);

    $('.card').css({top:-size, left:-size});
    for(i = 0; i < 12; ++i) {
        anim(i, $('#card' + cards[i]))();
    }
};

var lastClickTime = 0;
var prevCard = '';
function click(card) {
    if(card === prevCard && Date.now() - lastClickTime < 1000) {
            return;
    }
    prevCard = card;
    lastClickTime = Date.now();
    console.log(card);
    if(exports.selected[card]) {
        $('#card' + card).css(unselectedStyle);
        delete exports.selected[card];
    } else {
        $('#card' + card).css(selectedStyle);
        exports.selected[card] = true;
    }
    testSelected();
}

var score = 0;
function testSelected() {
    var list = Object.keys(exports.selected);
    if(list.length >= 3) {
        if(okSet(list[0], list[1], list[2])) {
            ++score;
            setTimeout(function() {
                list.forEach(function(id) {
                    $('#card'+id).css('opacity', 0);
                });
            }, 0);
            setTimeout(function() {
            var ids = [_(cards).indexOf(list[0]), _(cards).indexOf(list[1]), _(cards).indexOf(list[2])];
            do {
                for(var i = 0; i < 3; ++i) {
                    cards[ids[i]] = randomCard();
                }
            } while(!okDeck());
            doLayout();
            }, 2000);
        }
        $('.card').css(unselectedStyle);
        exports.selected = {};
    }
}


exports.selected = {};

function anim(i, $card) {
    return function() {
        $card.css(pos[i]);
        setTimeout(function() { $card.css(transitionStyle).css(visibleStyle); }, 0);
    };
}

function rnd3() {
    return Math.random() * 3 | 0;
}

function randomCard() {
    return '' + rnd3() + rnd3() + rnd3() + rnd3();
}

var cards = [];

function okSet(a, b, c) {
    for(var i = 0; i < 4; ++i) {
        var ok = (a[i] === b[i] && b[i] === c[i]) ||
            (a[i] !== b[i] && b[i] !== c[i] && c[i] !== a[i]);
        if(!ok) {
            return false;
        }
    }
    return true;
}

function okDeck() {
    var cardHash = {};
    var a, b, c;
    var i;
    for(i = 0; i < 12; ++i) {
        if(cardHash[cards[i]]) {
            return false;
        }
        cardHash[cards[i]] = true;
    }
    for(a = 0; a < 10; ++a) {
        for(b = a + 1; b < 11; ++b) {
            for(c = b + 1; c < 12; ++c) {
                if(okSet(cards[a], cards[b], cards[c])) {
                    return true;
                }
            }
        }
    }
    return false;
}

var finalTime;
function timer() {
    var now = Date.now();
    if(now > finalTime) {
        alert('Score: ' + score);
        menu();
    } else {
        var sec = (finalTime - now)/1000;
        $('#timer').text(
                (sec/60|0) + ':' + (''+(100 + (sec%60))).slice(1,3)
        );
        setTimeout(timer, 100);
    }
}
function startGame() {
    $('#content').html('<div id="timer"></div>');
    finalTime = Date.now() + 3 * 60 * 1000;
    timer();

    require('combigameCards').createCards($('#content').width()/3|0);
    $('.card').bind('touchstart mousedown', function(e) {
        click(e.target.id.slice(4));
        return true;
    });

    score = 0;
    do {
        cards = [];
        for(var i = 0; i < 12; ++i) {
            cards.push(randomCard());
        }
    } while(!okDeck());
    require('fullbrows').init({update: doLayout});
}

function menu() {
    $('#content').html('')
        .append(
            $('<div>')
                .text('Play')
                .bind('click', startGame)
        ).append(
            $('<div>')
                .text('Settings')
                .bind('click', settings)
        ).append(
            $('<div>')
                .text('Score')
                .bind('click', showScore)
        ).append(
            $('<div>')
                .text('Help')
                .bind('click', help)
        ).css({
            'font-family': 'sans-serif',
            'text-align': 'center',
            'width': '80%',
            'height': '80%',
            'left': '10%',
            'top': '10%'
        });
    $('#content>div').css({
    });
    require('webutil').scaleText($('#content'));
    $('#content').css('overflow', 'visible');
}
function help() {
}
function settings() {
}
function showScore() {
}

exports.run = function() {
    require('fullbrows').init({update: menu});
};
