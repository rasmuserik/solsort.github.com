/*global localStorage: true*/
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
var difficulty;
var doLayout = function() {
    var $content = $('#content');
    $content.css('background', 'white');
    var w = $content.width();
    var h = $content.height();
    var topPad, leftPad;
    var landscape = true;
    var i, x, y;

    pos = [];
    size = Math.min(Math.max(w,h)/4, Math.min(w,h)/3)*0.85;

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

    $('.card').css({top:-size, left:-size});
    for(i = 0; i < 12; ++i) {
        anim(i, $('#card' + cards[i]))();
    }
    $('.menuIcon').css({width: size/1.5, height: size/1.5});
    $('.menuEast').css({left: w - size/1.5});
    $('.menuSouth').css({top: h - size/1.5});

    $('.difficultyStatus').css({
        position: 'absolute',
        width: size/2.3,
        'font-family': 'sans-serif',
        top: size/1.5,
        'text-align': 'right',
        height: size*2,
        left: w - size/2
    });
    require('webutil').scaleText($('.difficultyStatus'));
    $('.difficultyStatus').css('overflow', 'visible');

};

var lastClickTime = 0;
var prevCard = '';
function click(card) {
    if(card === prevCard && Date.now() - lastClickTime < 100) {
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

function testSelected() {
    var list = Object.keys(exports.selected);
    if(list.length >= 3) {
        if(okSet(list[0], list[1], list[2])) {
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

function startGame() {
    require('fullbrows').init();
    $('#content').html('');

    require('combigameCards').createCards($('#content').width()/3|0);
    $('.card').bind('touchstart mousedown', function(e) {
        click(e.target.id.slice(4));
        e.preventDefault();
        return true;
    });

    $('#content').append(
        $('<img class="menuIcon" src="/images/help.png" alt="How to play">')
            .css('position', 'absolute')
    ).append(
        $('<img class="menuIcon menuEast" src="/images/difficulty.png" alt="Difficulty">')
            .css('position', 'absolute')
            .bind('click', function() { menu(
                {  easy:function() {
                    difficulty = 'easy';
                    startGame();
                }, normal: function () {
                    difficulty = 'normal';
                    startGame();
                }, hard: function() {
                    difficulty = 'hard';
                    startGame();
                }});})
    ).append(
        $('<img class="menuIcon menuSouth" src="/images/give-up.png" alt="Give up">')
            .css('position', 'absolute')
    ).append(
        $('<img class="menuIcon menuEast menuSouth" src="/images/score.png" alt="Score">')
            .css('position', 'absolute')
    );

    difficulty = difficulty || localStorage.getItem('combigameDifficulty') || 'normal';
    localStorage.setItem('combigameDifficulty', difficulty);
    $('#content').append($('<div class="difficultyStatus">').text(difficulty));


    do {
        cards = [];
        for(var i = 0; i < 12; ++i) {
            cards.push(randomCard());
        }
    } while(!okDeck());
    require('fullbrows').init({update: doLayout});
}

function menu(items) { require('fullbrows').init({update: function() {
    var item;
    var s = Math.min($('#content').height() + $('#content').width());
    var $menu = $('<div>');
    var $content = $('#content');
    $content.html('').append($menu);
    for(item in items) {
        $menu.append(
            $('<div>')
                .text(item)
                .css({
                    border: '1px solid black',
                    'border-radius': s * 0.02,
                    'font-family': 'sans-serif',
                    'text-align': 'center',
                    margin: s * 0.01,
                    padding: s * 0.01
                })
                .bind('click', items[item])
        );
    }
    require('webutil').scaleText($content);
    $content.css('font-size', parseInt($content.css('font-size'), 10) * 0.8);
    $menu.css('top', ($content.height() - $menu.height()) /2);
    $menu.css('position', 'absolute');
    $menu.css('width', '100%');
}});}

exports.run = function() {
    startGame();
};
