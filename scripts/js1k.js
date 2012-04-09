/*jshint evil: true, curly: false, asi:true, expr:true */
/*global a:true, c:true, p:true,d:true, clearInterval: true, clearTimeout: true, setInterval: true, window:true */
exports.app = {
    underbar: true,
    type: 'canvas',
    start: function() {
        c = this.elem;
        a = c.getContext('2d');
        js1k[this.param]();
    },
    stop: function() {
        var i, t;
        t = setTimeout(function(){}, 10000);
        for(i = 0; i <= t; ++i) {
            clearTimeout(i);
        }
        t = setInterval(function(){}, 10000);
        for(i = 0; i <= t; ++i) {
            clearInterval(i);
        }
    }
};

var js1k = {
    rain: function() {
        var d,e,g,h,x,i,j,t;
        c.width = 256;
        c.height= 256;
        d = a.getImageData(0,0,c.width,c.height);
        e = d.data;

        function blit() {
            a.putImageData(d,0,0);
        }

        g=[];
        h = [];
        for(x=0;x<10000;++x) {
            //g[x]=h[x]= 127;
        }
        function f() {
            for(i=0;i<65536;++i) {
                h[i] = ((g[i-1]+g[i+1]+g[i-256]+g[i+256])/2 - h[i])*0.99 || 0;
                //h[i] = ((g[i-257]+g[i-256]+g[i-255]+g[i-1]+g[i+1]+g[i+255]+g[i+256]+g[i+257])/4 - h[i])*.97 ||0;
                //e[i*4+1] = 0|(-g[i]/*-g[i+1]-g[i+256]*/);
                //e[i*4+2] = 0|(g[i]/*-g[i+1]-g[i+256]*/);
                e[i*4+3] = 255;
                e[i*4+2] = 255&(128+g[i]-g[i-257]);
            }
            j = g;
            g = h;
            h = j;
            t = Math.random()*65536|0;
            g[t] =  127;
            g[t+1] =  127;
            g[t+2] =  127;
            //g[256+t] =  127;
            g[256+t+1] =  127;
            //g[256+t+2] =  127;
            //g[512+t] =  127;
            g[512+t+1] =  127;
            //g[512+t+2] =  127;
            blit();
            setTimeout(f, 0);
        }
        f();
    },
    sierp: function() {
        c.width = c.height = 1000;
        var b,i,t=1000;
        for(b=[i=1];i<t*t;)(b[i+t]=b[i]^b[i++-1])&&a.fillRect(i%t,i/t,1,1)
    },
    brown: function() {
        c.width = c.height = 128;
        d=a.getImageData(p=0,0,128,128);setInterval("for(i=k=66055;--i;d.data[p%k]++)p+=Math.random()*k*k&k;a.putImageData(d,0,0)",50)
    },
    'julia4d': function() {
        // start of submission //
        c.width=796;
        c.height=512;
        /*
        c.width=1000;
        c.height=500;
        c.style.width="95%";
        c.style.height="95%";
        */
         var d,p, e, vs, k, pts, w0, wi0, w1, wi1, pts0, kcount, w, wi, j, Cx, Cy, v1, v2, x, y, i;



        d = a.getImageData(0,0,c.width,c.height);
        e = d.data;

        vs = 1;
        function blit() {
            a.putImageData(d,0,0);
        }

        function setp(x,y,e) {
            d.data[((y|0)*c.width+(x|0))*4+0] = 255&(e);
            d.data[(y*c.width+x)*4+3] = 255;

        }
        function incp(x,y,e) {
            if(0<x && x<c.width) {
            d.data[((y|0)*c.width+(x|0))*4+0] += 50;
        }
        }

        function fade() {
            for(var i=e.length;i>0; i-=4) {
                e[i-1]=255;
                e[i-2]=255&(e[i-2]*0.999);
                e[i-3]=255&(e[i-3]*0.999);
                e[i-4]=255&(e[i-4]*0.999);
            }
        }
        function clear() {
            for(var i=0;i<e.length;i+=4) {
                e[i]=0;
                e[i+3]=255;
            }
        }

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
            //pts = pts0;
            //pts0=[];
            k = 0;
            setTimeout(drawpts,0);
        //    d3();
        }
                    function sign(x) {
                        return x>0?1:-1;
                    }
        function drawpts() {
            for(;;){
            var z, zi, t, ti, r, s, Newz, Newzi;
            var random = Math.random;
            var sqrt = Math.sqrt;
            //clear();
            w = k/kcount*w0 + (1-k/kcount) * w1;
            wi = k/kcount*wi0 + (1-k/kcount) * wi1;
            // zn = z*z + w
            // z = sqrt(zn - w);
                z = random() * 2 - 1;
                zi = random() * 2 - 1;
                for(j=0;j<20;++j) {
                    // sqrt(z+zi-w-wi) = sqrt((z-w)+(zi-wi)) =
                    // r = sqrt(
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
            //blit();
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
        //drawpts();
        //d3();
        d3();


        function transform(pt) {
            v1 = 0.005*vs;
            v2 = 0.01*vs;
            var xa = pt.x * Math.cos(v1) - pt.y * Math.sin(v1);
            var ya = pt.x * Math.sin(v1) + pt.y * Math.cos(v1);
            var za = xa * Math.sin(v2) + pt.z * Math.cos(v2);
            xa = xa * Math.cos(v2) - pt.z * Math.sin(v2);
            return {x:xa, y:ya, z:za};
        }

        function d3() {
                clear();
                for(var i=0;i<pts.length;++i) {
                    p = pts[i];
                    p = transform(p);
                    incp((p.x+0.5)*c.width, (p.y+0.5)*c.height);
                    //console.log(p.x, p.y);
                    //pts[i] = p;
                }
                ++vs;
                blit();
                setTimeout(d3, 0);
        }

        x=y=100;
        function f() {
            for(var i=0;i<10000;++i){
            x=Math.abs(x%c.width)+Math.random()-0.5;
            y=Math.abs(y%c.height)+Math.random()-0.5;
                d.data[((y|0)*c.width+(x|0))*4+0] += 1;
            }
            fade();
            blit();
            setTimeout(f, 100);
        }
        /*
        t=0.1;
        function f() {
            t*=1.01
            for(y=0;y<c.height;++y) {
                for(x=0;x<c.width;++x) {
                }
            }
            blit();
            setTimeout(f, 0);
        }
        f()
        */


        for(i=0;i<d.data.length;++i) {
        //    d.data[i] = 255&(Math.random()*256)
        }
        a.putImageData(d,0,0);
        /*
        c.style.width = "95%";
        c.style.height = "95%";

        for(y=0;y<c.height;++y) {
            for(x=0;x<c.width;++x) {
                d.data[(x+y*c.width)*4+1]=0;
            }
        }
        */
    }
};
