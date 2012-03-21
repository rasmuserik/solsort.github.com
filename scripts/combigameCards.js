// Script for generating the graphics for a combigame.
// Combigame is a set™-like game.
// The card vary by: color, figure, number-of-figures, and fillstyle
//
var $ = require('zquery');
var document = require('document');

function draw(ctx, figure, color, fill, x, y, size) {
    var colorPrefix = ['rgba(255,0,0,', 'rgba(0,255,0,', 'rgba(0,0,255,'] [color];
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

function drawCard(color, figure, count, fill) {
    var name = 'canvas' + color + figure + count + fill;
    $('body').append('<canvas id="' + name +'">');
    var canvas = document.getElementById(name);
    var size = 100;
    console.log(canvas);
    canvas.width = canvas.height = canvas.style.width = canvas.style.height = size;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    //ctx.fillRect(0,0,size,size);
    if(count === 0) {
        draw(ctx, figure, color, fill, 50, 50, 35);
    }
    if(count === 1) {
        draw(ctx, figure, color, fill, 30, 30, 20);
        draw(ctx, figure, color, fill, 70, 70, 20);
    }
    if(count === 2) {
        draw(ctx, figure, color, fill, 50, 30, 15);
        draw(ctx, figure, color, fill, 30, 70, 15);
        draw(ctx, figure, color, fill, 70, 70, 15);
    }
}

exports.run = function() {
    //require('fullbrows').init();
    console.log('here');
    $('#content').html();
    for(var color = 0; color < 3; ++color) {
        for(var figure = 0; figure < 3; ++figure) {
            for(var count = 0; count < 3; ++count) {
                for(var fill = 0; fill < 3; ++fill) {
                    drawCard(color, figure, count, fill);
                }
            }
        }
    }
};
