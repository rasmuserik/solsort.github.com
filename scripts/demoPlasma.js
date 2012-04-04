exports.app = { type: 'canvas', update: function() {
    var canvas = this.elem;
    canvas.width = canvas.height = 512;
    var ctx = canvas.getContext('2d');
    
    var img = ctx.createImageData(512,512);
    var x, y;
    
    var col = 0;
    function get(x,y) {
        return img.data[((x&511)+(y&511)*512)*4+col];
    }
    function put(x,y,c) {
        img.data[((x&511)+(y&511)*512)*4+col] = c;
    }
    
    var i = 0;
    for(i=0;i<img.data.length>>2; ++i) {
        img.data[i*4+3] = 255;
    }
    var step = 512;
    function colrand() {
        return (Math.random()-0.5) * step * 3;
        //return (Math.random()-0.5) * step *1.4;
        //return (Math.random()-0.5) * 80;
    }
    function plasma() {
    while(step > 0) {
        // diamond
        var prevStepMask = (step<<1) - 1;
        for(x = 0; x < 512; x += step) {
            for(y = 0; y < 512; y += step) {
                if((y&prevStepMask) && (x&prevStepMask)) {
                    col = 0;
                    put(x,y, (get(x-step, y-step) + get(x+step, y+step) + get(x+step,y-step) + get(x-step,y+step))/4 + colrand());
                    col = 1;
                    put(x,y, (get(x-step, y-step) + get(x+step, y+step) + get(x+step,y-step) + get(x-step,y+step))/4 + colrand());
                    col = 2;
                    put(x,y, (get(x-step, y-step) + get(x+step, y+step) + get(x+step,y-step) + get(x-step,y+step))/4 + colrand());
                }
            }
        }
        for(x = 0; x < 512; x += step) {
            for(y = 0; y < 512; y += step) {
                if( (!(y&prevStepMask) && (x&prevStepMask)) || ((y&prevStepMask) && !(x&prevStepMask))
                ) {
                    col = 0;
                    put(x,y, (get(x-step, y) + get(x+step, y) + get(x,y-step) + get(x,y+step))/4 + colrand());
                    col = 1;
                    put(x,y, (get(x-step, y) + get(x+step, y) + get(x,y-step) + get(x,y+step))/4 + colrand());
                    col = 2;
                    put(x,y, (get(x-step, y) + get(x+step, y) + get(x,y-step) + get(x,y+step))/4 + colrand());
                }
            }
        }
    
        step >>= 1;
    }
    }
    plasma();
    col=1;
    plasma();
    col=2;
    plasma();
    ctx.putImageData(img,0,0);
}};
