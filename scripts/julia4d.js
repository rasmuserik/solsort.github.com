// # 4d julia-mandelbrot set
// Just playing around :)
var running;
exports.app = {
    underbar: true,
    type: 'canvas',
    start: function() {
        running = true;
        julia4d(this.elem);

    },
    stop: function() {
        running = false;
    }
};

// First we project into 3d by taking a line(segment) mandelbrotplane as the z-axis, and for each point on the line, find the corresponding julia-pointcloud in the xy-plane.
function julia4d(canvas) {
    var pts = [];
    // ## Projection from 4d to 3d
    (function() {
        var k;

        // utility function
        function sign(x) { return x > 0 ? 1 : -1; }

        // w0-w1 is the line segment in the mandelbrot plane along which we are tracing the julia sets.
        var w0, wi0, w1, wi1;
        // randomise position of line segment
        w0 = wi0 = w1 = wi1 = 0;
        newpts();
        function newpts() {
            w0 += Math.random()-0.5;
            wi0 += Math.random()-0.5;
            w1 += Math.random()-0.5;
            wi1 +=  Math.random()-0.5;
            k = 0;
            // dispatch to do the actual projection
            setTimeout(drawpts,0);
        }

        // trace along the line segment and generate the 3d point cloud
        function drawpts() {
            // number of discrete samplings along the line in the mandelbrot plane
            var kcount = 30000;
            for(;;){
                if(!running) {
                    return;
                }
                var Newz, Newzi;
                var random = Math.random;
                var sqrt = Math.sqrt;
                var w = k/kcount*w0 + (1-k/kcount) * w1;
                var wi = k/kcount*wi0 + (1-k/kcount) * wi1;
                var z = random() * 2 - 1;
                var zi = random() * 2 - 1;
                for(var j=0;j<20;++j) {
                    var Cx = w;
                    var Cy = wi;
                    z=z-Cx;
                    zi=zi-Cy;
                    if (z>0) {
                         Newz=sqrt((z+sqrt(z*z+zi*zi))/2);
                         Newzi=zi/(2*Newz);
                    } else /* ZX <= 0 */ {
                        if(z<0) {
                            Newzi=sign(zi)*sqrt((-z+sqrt(z*z+zi*zi))/2);
                            Newz=zi/(2*Newzi);
                        } else /* z=0 */ {
                            Newz=sqrt(Math.abs(zi)/2);
                            if (Newz>0) {
                                Newzi=zi/(2*Newz);
                            } else {
                                Newzi=0;
                            }
                        }
                    }
                    if (random()<0.5) {
                        z=Newz;
                        zi=Newzi;
                    } else {
                        z=-Newz;
                        zi=-Newzi;
                    }
                    pts[k] = ({x:z/8, y:zi/8, z:k/kcount/2-0.25});
                }
                ++k;

                if(k%300===0) {
                    if(k < kcount) {
                        setTimeout(drawpts, 0);
                    } else {
                        setTimeout(newpts,0);
                    }
                    return;
                }
            }
        }
    })();


    // ## Project the 3d point cloud onto the screen
    (function() {
        var ctx = canvas.getContext('2d');
        var width = canvas.width = 512;
        var height = canvas.height = 512;
        var image = ctx.getImageData(0,0,width,height);
        var pixels = image.data;
        var baseAngle = 0;
        function transform(pt) {
            var a1 = 0.005*baseAngle;
            var a2 = 0.01*baseAngle;
            var x = pt.x * Math.cos(a1) - pt.y * Math.sin(a1);
            var y = pt.x * Math.sin(a1) + pt.y * Math.cos(a1);
            var z = x * Math.sin(a2) + pt.z * Math.cos(a2);
            x = x * Math.cos(a2) - pt.z * Math.sin(a2);
            return {x:x, y:y, z:z};
        }
        function increasePixel(x,y) {
            if(0<x && x<width) {
                pixels[((y|0)*width+(x|0))*4+0] += 50;
            }
        }
        function clear() {
            for(var i=0;i<pixels.length;i+=4) {
                pixels[i]=0;
                pixels[i+3]=255;
            }
        }
        function drawToScreen() {
                if(!running) {
                    return;
                }
                clear();
                for(var i=0;i<pts.length;++i) {
                    var p = pts[i];
                    p = transform(p);
                    increasePixel((p.x+0.5)*width, (p.y+0.5)*height);
                }
                ++baseAngle;
                ctx.putImageData(image,0,0);
                setTimeout(drawToScreen, 20);
        }
        drawToScreen();
    })();
}
