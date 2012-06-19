var Canvas = require('canvas');
var size = 512;
var color, figure, count, fill, canvas;

for(color = 0; color < 3; ++color) {
    for(figure = 0; figure < 3; ++figure) {
        for(count = 0; count < 3; ++count) {
            for(fill = 0; fill < 3; ++fill) {
                canvas = new Canvas(size, size);
                require('./combigameCards.js').drawCard(canvas, color, figure, count, fill, size); 
                writePng(canvas, '' + color + figure + count + fill);
            }
        }
    }
}

function writePng(canvas, name) {
    var out = require('fs').createWriteStream('../dist/combigame' + name + '.png');
    var stream = canvas.createPNGStream();
    stream.on('data', function(chunk){
        out.write(chunk);
    });
};
