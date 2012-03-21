var cardSprites;
var $ = require('zquery');

var pointStyle = {
    margin: 0,
    width: 0,
    height: 0
};

var transitionStyle = {
    'transition': '2s',
    '-moz-transition': '2s',
    '-webkit-transition': '2s',
    '-o-transition': '2s'
};


var noTransitionStyle = {
    'transition': '0s',
    '-moz-transition': '0s',
    '-webkit-transition': '0s',
    '-o-transition': '0s'
};

var visibleStyle;
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
        topPad = (h - size * 3) >> 2;
        leftPad = (w - size * 4) >> 2;
    } else {
        topPad = (h - size * 4) >> 2;
        leftPad = (w - size * 3) >> 2;
        landscape = false;
    }

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
        'margin-top': -size/2,
        'margin-left': -size/2,
        width: size,
        height: size
    };

    cardSprites = cardSprites || require('combigameCards').createCards(size);
    for(i = 0; i < 12; ++i) {
        anim(i, $('#canvas' + cards[i]))();
    }
};

function anim(i, $canvas) {
    return function() {
        $canvas.css(pos[i]);
        setTimeout(function() { $canvas.css(transitionStyle).css(visibleStyle); }, 0);
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
