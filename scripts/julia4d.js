/*jshint evil:true curly:false asi:true expr:true */
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

function julia4d(canvas) {
    var pts;

        var d,p, e, k, w0, wi0, w1, wi1, pts0, kcount, w, wi, j, Cx, Cy, v1, v2, x, y, i;




        k=0;
        pts = [];
        w0 = Math.random()*(Math.random() - Math.random());
        wi0 = Math.random()*(Math.random() - Math.random());
        w1 = Math.random()*(Math.random() - Math.random());
        wi1 = Math.random()*(Math.random() - Math.random());
        w0=wi0=w1=wi1=0;
        pts0 = [];
        kcount = 30000;
        newpts();
        function newpts() {
            w0 += Math.random()*-0.5;
            wi0 += Math.random()*-0.5;
            w1 += Math.random()*-0.5;
            wi1 +=  Math.random()*-0.5;
            k = 0;
            if(running) {
                setTimeout(drawpts,0);
            }
        }
        function sign(x) {
            return x>0?1:-1;
        }
        function drawpts() {
            for(;;){
            var z, zi, t, ti, r, s, Newz, Newzi;
            var random = Math.random;
            var sqrt = Math.sqrt;
            w = k/kcount*w0 + (1-k/kcount) * w1;
            wi = k/kcount*wi0 + (1-k/kcount) * wi1;
                z = random() * 2 - 1;
                zi = random() * 2 - 1;
                for(j=0;j<20;++j) {
                        Cx = w;
                        Cy = wi;

                        z=z-Cx;
                        zi=zi-Cy;
                        if (z>0)
                        {
                         Newz=sqrt((z+sqrt(z*z+zi*zi))/2);
                         Newzi=zi/(2*Newz);
                         }
                         else /* ZX <= 0 */
                         {
                          if (z<0)
                             {
                              Newzi=sign(zi)*sqrt((-z+sqrt(z*z+zi*zi))/2);
                              Newz=zi/(2*Newzi);
                              }
                              else /* z=0 */
                              {
                               Newz=sqrt(Math.abs(zi)/2);
                               if (Newz>0) Newzi=zi/(2*Newz);
                                  else Newzi=0;
                              }
                         }
                      if (random()<0.5)
                      {
                          z=Newz;
                          zi=Newzi;
                          }
                      else {z=-Newz;
                          zi=-Newzi; }


                    pts[k] = ({x:z/8, y:zi/8, z:k/kcount/2-0.25});
                }
            ++k;
            if(k%300===0) {
            if(k < kcount) {
                setTimeout(drawpts, 0);
            } else {
                setTimeout(newpts,0);
            }
                return
            }
        }
        }


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
                clear();
                for(var i=0;i<pts.length;++i) {
                    var p = pts[i];
                    p = transform(p);
                    increasePixel((p.x+0.5)*width, (p.y+0.5)*height);
                }
                ++baseAngle;
                ctx.putImageData(image,0,0);
                if(running) {
                    setTimeout(drawToScreen, 20);
                }
        }
        drawToScreen();
    })();
}
