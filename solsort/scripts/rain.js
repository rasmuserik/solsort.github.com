// # Rain demo effect
// Coded very minimalistic.

// Setup environment / app-wrapping
var running;
exports.app = {
    underbar: true,
    type: 'canvas',
    start: function() {
        running = true;
        // http://js1k.com/ environment.
        var c = this.elem;
        var a = c.getContext('2d');

        // ## Actual program

        // Setup size.
        var size = c.width = c.height = 256;
        
        // Access to canvas imagebuffer.
        var image = a.getImageData(0,0,size,size);
        var imageBuffer = image.data;

        // Initialise height buffers.
        var g = [];
        var h = [];

        // Start main loop function.
        f();
        function f() { if(running) {

            // Splash a random drop.
            var pos = Math.random()*size*size|0;
            g[pos]=g[pos+1]=g[pos+2]=g[size+pos+1]=g[2*size+pos+1]=127;

            // Swap height buffers.
            var t = g; g = h; h = t;

            // Propagate waves / calculate height buffer.
            for(var i=0;i<size*size;++i) {
                h[i] = ((g[i-1]+g[i+1]+g[i-size]+g[i+size])/2 - h[i])*0.99 || 0;

                // Set alpha and color.
                imageBuffer[i*4+3] = 255;
                imageBuffer[i*4+2] = 255&(128+h[i]-h[i-size-1]);
            }

            // Blit.
            a.putImageData(image,0,0);
            // Repeat.
            setTimeout(f, 0);
        }}
        // ## Cleanup code (app-wrapping)
        
        //
    },
    stop: function() {
        running = false;
    }
};

