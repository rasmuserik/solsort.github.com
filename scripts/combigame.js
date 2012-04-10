/*global localStorage: true*/
var $ = require('zquery');
var _ = require('underscore');
var webutil = require('webutil');
var fullbrows = require('fullbrows');
var Modernizr = require('modernizr');

var hidden = {
    opacity: 0,
    width: 0,
    height: 0
};

var transitionStyle = {
    'transition': 'opacity 1s',
    '-moz-transition': 'opacity 1s',
    '-webkit-transition': 'opacity 1s',
    '-o-transition': 'opacity 1s'
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
    size = Math.min(Math.max(w,h)/4, Math.min(w,h)/3); //*0.85;

    if(w > h) {
        topPad = (h - size * 3) >> 1;
        leftPad = (w - size * 4) >> 1;
    } else {
        topPad = (h - size * 4) >> 1;
        leftPad = (w - size * 3) >> 1;
        landscape = false;
    }
    topPad += 0; //0.05*size;
    leftPad += 0; //0.05*size;

    for(i = 0; i < 12; ++i) {
        if(landscape) {
            pos.push({
                top: topPad + (0.5 + (i%3)) * size,
                left: leftPad + (0.5 + (i/3|0)) * size
            });
        } else {
            pos.push({
                left: leftPad + (0.5 + (i%3)) * size,
                top: topPad + (0.5 + (i/3|0)) * size
            });
        }
    }


    visibleStyle = {
        opacity: 1,
        'margin-top': -size/2,
        'margin-left': -size/2,
        background: 'none',
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

    $('.card').css({top:h, left:w});
    for(i = 0; i < 12; ++i) {
        anim(i, $('#card' + cards[i]))();
    }
    $('.menuIcon').css({width: size/1.5, height: size/1.5});
    $('.menuEast').css({left: w - size/1.5});
    $('.menuSouth').css({top: h - size/1.5});
};

var lastClickTime = 0;
var prevCard = '';
function click(card) {
    if(card === prevCard && Date.now() - lastClickTime < 100) {
            return;
    }
    prevCard = card;
    lastClickTime = Date.now();
    if(exports.selected[card]) {
        $('#card' + card).css(unselectedStyle);
        delete exports.selected[card];
    } else {
        $('#card' + card).css(selectedStyle);
        exports.selected[card] = true;
    }
    testSelected();
}

function shuffle(fn) {
    var score, bestscore = -10000, saved;
    var i;
    for(i=0;i<10;++i) {
        do {
            fn();
            score = okDeck();
        } while(!score);

        if(difficulty === 'normal') {
            saved = cards;
            break;
        }

        if(difficulty === 'hard') {
            score = -score;
        }
        if(score > bestscore) {
            saved = cards.slice(0);
            bestscore = score;
        }
    }
    cards = saved;
}

var logData;
var curDate;
function log(obj) {
    setTimeout(function() {
        var objDate = (obj.now /24/60/60/1000) | 0;
        if(objDate !== curDate) {
            curDate = objDate;
            logData = JSON.parse(localStorage.getItem('combigamelog' + curDate) || '[]');
        }
        logData = logData || [];
        logData.push(obj);
        localStorage.setItem('combigamelog' + curDate, JSON.stringify(logData));
    }, 0);
}

function partialScore($t, title, log) {
    if(log.length > 0) {
        if(title) { $t.append($('<div><b>' + title+ '</b></div>')); }
        $t.append($('<div>Best time: ' + (log[0].time/10|0)/100 + 's'));
        $t.append($('<div>Median time: ' + (log[(log.length >> 1)].time/10|0)/100 + 's'));
    }
}
function showScore() { fullbrows.start({hideButtons: true, update:function() {
    var $t = $('<div>');
    var log = _(logData)
            .filter(function(elem) { return !elem.hint && elem.difficulty === difficulty; })
            .sort(function(a,b) { return a.time - b.time; });
    $t.append($('<h3>Timings\xa0' + difficulty + '</h3>'));
    if(log.length === 0) {
        $t.append('<p>No score available for this difficulty, please play the game before looking at the timings.</p>');
    }
    partialScore($t, 'Today', log);
    partialScore($t, 'Last five minutes', log.filter(function(elem) {
            return Date.now() - elem.now < 5*60*1000;
            }));
    partialScore($t, 'Last minute', log.filter(function(elem) {
            return Date.now() - elem.now < 60*1000;
            }));
    $t.append('<p>Click to close.</p>');


    $('#content').html('').append($t);
    $t.css({width: '80%', height:'90%'});
    webutil.scaleText($t);
    $t.css({margin: '3% 10% 7% 10%', overflow: 'visible'});
    $t.bind('mousedown touchstart', fullbrows.startFn(exports.app));
}});}

function testSelected() {
    var list = Object.keys(exports.selected);
    if(list.length >= 3) {
        if(okSet(list[0], list[1], list[2])) {
            var now = Date.now();
            log({time: now - prevtime, hint: giveup, cards: cards.slice(0), choosen: list, now: now, difficulty: difficulty});
            giveup = false;
            prevtime = now;

            setTimeout(function() {
                list.forEach(function(id) {
                    $('#card'+id).css('opacity', 0);
                });
            }, 0);
            setTimeout(function() {
                $('.card').css(unselectedStyle);
                var ids = [_(cards).indexOf(list[0]), _(cards).indexOf(list[1]), _(cards).indexOf(list[2])];
                shuffle(function() {
                    for(var i = 0; i < 3; ++i) {
                        cards[ids[i]] = randomCard();
                    }
                });
                doLayout();
            }, 1000);
        } else {
            $('.card').css(unselectedStyle);
        }
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

function hint() {
    exports.selected = {};
    $('.card').css(unselectedStyle);
    var a, b, c;
    for(a = 0; a < 10; ++a) {
        for(b = a + 1; b < 11; ++b) {
            for(c = b + 1; c < 12; ++c) {
                if(okSet(cards[a], cards[b], cards[c])) {
                    $('#card'+cards[a])
                        .css(selectedStyle)
                        .css({'opacity': 0.6, background: '#ccc', border: '1px solid #bbb'});
                    $('#card'+cards[b])
                        .css(selectedStyle)
                        .css({'opacity': 0.6, background: '#ccc', border: '1px solid #bbb'});
                    $('#card'+cards[c])
                        .css(selectedStyle)
                        .css({'opacity': 0.6, background: '#ccc', border: '1px solid #bbb'});
                    giveup = true;
                    return;
                }
            }
        }
    }
}

function okDeck() {
    var cardHash = {};
    var a, b, c;
    var i;
    var ok = 0;
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
                    ++ok;
                }
            }
        }
    }
    return ok;
}

var prevtime;
var giveup;
function startGame() {
    giveup = false;
    var $content = $('#content');
    $content.html('');
    prevtime = Date.now();

    //require('combigameCards').createCards($('#content').width()/3|0);
    var i, j, k, l;
    for(i = 0;i < 3;++i) { for(j = 0;j < 3;++j) { for(k = 0;k < 3;++k) { for(l = 0;l < 3;++l) {
        $content.append(
            $('<img class="card" src="dist/combigame' +i+j+k+l+ '.png" id="card' +i+j+k+l+ '">'));
    } } } }
    $('.card').css({position: 'absolute', opacity: '0'});

    
    $('.card').bind('touchstart mousedown', function(e) {
        click(e.target.id.slice(4));
        e.preventDefault();
        return true;
    });

    difficulty = difficulty || localStorage.getItem('combigameDifficulty') || 'normal';

    fullbrows.addButton({imagePath: "img/help.png", callback: showHelp});
    //fullbrows.addButton({imagePath: "img/difficulty.png", callback: showDifficulty});
    fullbrows.addButton({imagePath: "img/give-up.png", callback: hint});
    fullbrows.addButton({imagePath: "img/score.png", callback: showScore});
    fullbrows.addButton({text: '' + difficulty, callback: showDifficulty});

            function showHelp() {
                fullbrows.start({hideButtons: true, update:function() {
                    var html = require('jsxml').toXml(
                        ["div",
                            ["h2", "CombiGame"],
                            "Game objectives: click on combinations of three figures where color, count, shape, and fill, are either the same or all different.", ["br"],
                            ['p',
                                ['img', {style:'height: 1.5em; width: 1.5em;',src:'img/give-up.png'}],
                                ' shows a valid combination among the figures.', ['br'],
                                ['img', {style:'height: 1.5em; width: 1.5em;',src:'img/difficulty.png'}],
                                ' sets difficulty •\xa0easy    : ca. 6 valid combinations •\xa0hard: 1 valid combination •\xa0normal: random number of valid combinations.', ['br'],
                                ['img', {style:'height: 1.5em; width: 1.5em;',src:'img/score.png'}],
                                ' shows latest timing for the current difficulty.', ['br']],
                            'Click to close.']);

                        var $t = $('<div>');
                        $t.html(html);
                        $('#content').html('').append($t);
                        $t.css({width: '90%', height:'90%'});
                        webutil.scaleText($t);
                        $t.css({margin: '2% 5% 8% 5%', overflow: 'visible'});
                        $t.bind('mousedown touchstart', fullbrows.startFn(exports.app));
                }});
            }
            function showDifficulty() { menu(
                {  easy: function() {
                    difficulty = 'easy';
                    fullbrows.start(exports.app);
                }, normal: function () {
                    difficulty = 'normal';
                    fullbrows.start(exports.app);
                }, hard: function() {
                    difficulty = 'hard';
                    fullbrows.start(exports.app);
            }});}

    localStorage.setItem('combigameDifficulty', difficulty);

    shuffle(function() {
        cards = [];
        for(var i = 0; i < 12; ++i) {
            cards.push(randomCard());
        }
    });
    doLayout();
}

function menu(items) { fullbrows.start({hideButtons: true, update: function() {
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
                    'text-align': 'center',
                    margin: s * 0.01,
                    padding: s * 0.01
                })
                .bind('click', items[item])
        );
    }
    webutil.scaleText($content);
    $content.css('font-size', parseInt($content.css('font-size'), 10) * 0.8);
    $menu.css('top', ($content.height() - $menu.height()) /2);
    $menu.css('position', 'absolute');
    $menu.css('width', '100%');
}});}

exports.app = {
    start: startGame,
    update: doLayout
};
