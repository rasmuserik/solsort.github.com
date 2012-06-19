// Script for generating the graphics for a combigame.
// Combigame is a set™-like game.
// The card vary by: color, figure, number-of-figures, and fillstyle
/*global document:true */

try {
    // zquery is a browser-only lib, so this should fail on node
    var $ = require('zquery');
} catch(e) {
}

function draw(ctx, figure, color, fill, x, y, size) {
    var colorPrefix = ['rgba(180,0,180,', 'rgba(50,200,0,', 'rgba(0,150,230,'] [color];
    ctx.lineWidth = size / 10;
    ctx.lineJoin= 'round';
    ctx.lineCap= 'round';
    ctx.fillStyle = colorPrefix + ['0)', '0.4)', '1)'][fill];
    ctx.strokeStyle = colorPrefix + '1)';
    ctx.beginPath();
    if(figure === 0) {
        ctx.arc(x, y, size, 0, Math.PI*2);
    }
    if(figure === 1) {
        ctx.moveTo(x,y-size);
        ctx.lineTo(x+size,y+size);
        ctx.lineTo(x-size,y+size);
        ctx.lineTo(x,y-size);
    }
    if(figure === 2) {
        ctx.moveTo(x-size,y-size);
        ctx.lineTo(x+size,y-size);
        ctx.lineTo(x+size,y+size);
        ctx.lineTo(x-size,y+size);
        ctx.lineTo(x-size,y-size);
    }
    ctx.fill();
    ctx.stroke();
}


exports.drawCard = function(canvas, color, figure, count, fill, size) {
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    if(count === 0) {
        draw(ctx, figure, color, fill, size * 0.50, size * 0.50, size * 0.35);
    }
    if(count === 1) {
        draw(ctx, figure, color, fill, size * 0.30, size * 0.30, size * 0.20);
        draw(ctx, figure, color, fill, size * 0.70, size * 0.70, size * 0.20);
    }
    if(count === 2) {
        draw(ctx, figure, color, fill, size * 0.50, size * 0.30, size * 0.15);
        draw(ctx, figure, color, fill, size * 0.30, size * 0.70, size * 0.15);
        draw(ctx, figure, color, fill, size * 0.70, size * 0.70, size * 0.15);
    }
};

function createCard(color, figure, count, fill, size) {
    var name = exports.name(color, figure, count, fill);
    $('#content').append('<canvas id="' + name +'">');
    var canvas = document.getElementById(name);
    $(canvas).addClass('card');

    exports.drawCard(canvas, color, figure, count, fill, size);
    canvas.style.opacity = '0';
    canvas.style.position = 'absolute';
    return canvas;
}

exports.createCards = function(size) {
    $('#content').html();
    var result = [];
    for(var color = 0; color < 3; ++color) {
        for(var figure = 0; figure < 3; ++figure) {
            for(var count = 0; count < 3; ++count) {
                for(var fill = 0; fill < 3; ++fill) {
                    result.push(createCard(color, figure, count, fill, size));
                }
            }
        }
    }
    return result;
};

exports.name = function(color, figure, count, fill) {
    return 'card' + color + figure + count + fill;
};
