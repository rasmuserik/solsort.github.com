// # Plasma
//
// App that draws a simple plasma cloud. Each color incremental.
//
// It uses the diamond-square algorithm, see http://en.wikipedia.org/wiki/Diamond-square_algorithm for details.
exports.app = {
    underbar: true,
    type: 'canvas',
    start: function() {
        var size = 128;
        var canvas = this.elem;
        canvas.width = canvas.height = size;
        var ctx = canvas.getContext('2d');
        var img = ctx.createImageData(size,size);
        setTimeout(function() { drawPlasma(0); }, 0);
        setTimeout(function() { drawPlasma(1); }, 0);
        setTimeout(function() { drawPlasma(2); }, 0);
        function drawPlasma(color) {
            var p = diamondSquare(size);
            var min = p.reduce(function(a,b) { return a<b?a:b; }, Infinity);
            var max = p.reduce(function(a,b) { return a>b?a:b; }, -Infinity);
            for(var i=0;i<img.data.length>>2; ++i) {
                img.data[i*4+color] = (p[i]-min)*256/(max-min);
                img.data[i*4+3] = 255;
            }
            ctx.putImageData(img,0,0);
        }
    }
};


// ## Diamond-square algorithm
function diamondSquare(size, rnd) {
    var step, x, y, sizeMask, result;
    // Sanitise parameters
    if(size & (size-1) !== 0) {
        throw {error: 'size parameter must be a power of two'};
    }
    if(typeof rnd !== 'function') {
        rnd = function(scale) {
            return (Math.random()-0.5) * scale;
        };
    }

    // The array which will contain the fractal.
    // Initialisation of the first parameter is the base height of the fractal.
    result = [0];

    // Precalculated mask for module when out of boundaries.
    sizeMask = size - 1;

    // Shorthand function for getting a xy-element of the result array.
    function get(x,y) {
        return result[(x&sizeMask)+(y&sizeMask)*size];
    }

    for(step = size; step > 0; step >>= 1) {
        var prevStepMask = (step<<1) - 1;
        // Square part of the algorithm
        for(x = 0; x < size; x += step) {
            for(y = 0; y < size; y += step) {
                if((y&prevStepMask) && (x&prevStepMask)) {
                    result[x+y*size] = (
                            get(x-step, y-step) +
                            get(x+step, y+step) +
                            get(x+step,y-step) +
                            get(x-step,y+step))/4 + rnd(step);
                }
            }
        }
        // Diamond part of the algorithm
        for(x = 0; x < size; x += step) {
            for(y = 0; y < size; y += step) {
                if( (!(y&prevStepMask) && (x&prevStepMask)) ||
                    (!(x&prevStepMask) && (y&prevStepMask))) {
                    result[x+y*size] = (
                            get(x-step, y) +
                            get(x+step, y) +
                            get(x,y-step) +
                            get(x,y+step))/4 + rnd(step);
                }
            }
        }
    }
    return result;
}
