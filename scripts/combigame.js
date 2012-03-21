var cardSprites;
var $ = require('zquery');
var _ = require('underscore');

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

    cardSprites = cardSprites || require('combigameCards').createCards(size);

    $('.card').css({top:-size, left:-size});
    for(i = 0; i < 12; ++i) {
        anim(i, $('#card' + cards[i]))();
    }

    $('.card').bind('touchstart mousedown', function(e, e2) {
        click(e.target.id.slice(4));
    });
};

function click(card) {
    console.log(card);
    if(exports.selected[card]) {
        $('#card' + card).css(unselectedStyle);
        setTimeout(function() { delete exports.selected[card]; }, 100);
    } else {
        $('#card' + card).css(selectedStyle);
        setTimeout(function() { exports.selected[card] = true; }, 100);
    }
    setTimeout(testSelected, 130);
}

function testSelected() {
    var list = Object.keys(exports.selected);
    if(list.length >= 3) {
        if(okSet(list[0], list[1], list[2])) {
            list.forEach(function(id) {
                $('#card'+id).css('opacity', 0);
            });
            setTimeout(function() {
                list.forEach(function(id) {
                    $('#card'+id).css('opacity', 0);
                });
            }, 0);
            var ids = [_(cards).indexOf(list[0]), _(cards).indexOf(list[1]), _(cards).indexOf(list[2])];
            do {
                for(var i = 0; i < 3; ++i) {
                    cards[ids[i]] = randomCard();
                }
            } while(!okDeck());
            doLayout();
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

exports.run = function() {
    require('fullbrows').init({update: doLayout});
    $('#content').html();
    do {
        cards = [];
        for(var i = 0; i < 12; ++i) {
            cards.push(randomCard());
        }
    } while(!okDeck());
    doLayout();
    require('fullbrows').init({update: doLayout});
};
