// Experiment in minimalism, how small can you write a program that draws 2d browninan noise. Warning: _never_ code like this ;)
//
// It works by doing a random walk in a canvas and incrementing the pixel value.
//
// - `p` contains a binary encoding of the current xy-position
// - `i` is a counter to make sure that we do a reasonably long random walk before blitting
// - `k` is a magical number such that `random&k` is +/- 0/1 +/- 0/256 modulo k
// - `d` is the image buffer
/*jshint evil:true asi:true*/
/*global i:true k:true d:true p:true a:true setInterval:true clearInterval:true*/
// App setup.
exports.app = {
    underbar: true,
    type: 'canvas',
    start: function() {
        // Make a js1k-like context, - see http://js1k.com/.
        var c = this.elem;
        a = c.getContext('2d');
        // Set canvas size
        c.width = c.height = 128;
        // The actual program. 126 bytes :)
        d=a.getImageData(p=0,0,128,128);setInterval("for(i=k=66055;--i;d.data[p%k]++)p+=Math.random()*k*k&k;a.putImageData(d,0,0)",50)
        // Cleanup code when exiting the program
    },
    stop: function() {
        var i, t;
        t = setInterval(function(){}, 10000);
        for(i = 0; i <= t; ++i) {
            clearInterval(i);
        }
    }
};
