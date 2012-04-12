var running;
exports.app = {
    underbar: true,
    type: 'canvas',
    start: function() {
        running = true;
        var app = this;
        var canvas = this.elem;
        canvas.width = this.$.width();
        canvas.height = this.$.height();
        running = true;
        var basegraph = {};
        for(var i = 0; i <100; ++i) {
            basegraph[i] = [];
            basegraph[Math.random() * Math.random()*i|0].push(i);
            basegraph[Math.random() * Math.random()*i|0].push(i);
        }
        //   var basegraph = {"1":[2],"2":[100,101,102],"3":[4,5,6],"4":[69,46,70,48,71],"5":[59,60],"6":[],"7":[8],"8":[19,31,32,33],"9":[2],"10":[11,12,13,14],"11":[],"12":[],"13":[],"14":[],"15":[16],"16":[],"17":[18],"18":[30],"19":[20,21,22],"20":[41],"21":[],"22":[11,12,13,14,89],"23":[24,25,26,27,28],"24":[],"25":[62],"26":[],"27":[],"28":[],"29":[3,23],"30":[19,31,32,33],"31":[50,51,52,53],"32":[],"33":[64,65,66],"34":[35,36],"35":[89],"36":[],"37":[38],"38":[54],"39":[40],"40":[8],"41":[],"42":[43,44,45],"43":[],"44":[],"45":[],"46":[47],"47":[],"48":[43,44,45],"49":[50,51,52,53],"50":[],"51":[],"52":[],"53":[],"54":[20,21,22],"55":[56,57,58],"56":[69,46,70,48,71],"57":[],"58":[],"59":[],"60":[],"61":[59,60],"62":[72,73,74],"63":[64,65,66],"64":[],"65":[],"66":[],"67":[68],"68":[],"69":[91,92,93,94],"70":[],"71":[15],"72":[],"73":[],"74":[],"75":[34,76,77,67],"76":[90,110],"77":[],"78":[79],"79":[54],"80":[79],"81":[82,83],"82":[],"83":[],"84":[7],"85":[86,87,88],"86":[],"87":[],"88":[],"89":[16],"90":[86,87,88],"91":[],"92":[],"93":[],"94":[],"95":[47],"96":[91,92,93,94],"97":[15,82,83],"98":[34,76,77,67],"99":[100,101,102],"100":[35,36],"101":[],"102":[],"103":[40],"104":[18],"105":[7],"106":[107],"107":[38],"108":[56,57,58],"109":[75],"110":[],"111":[30],"112":[113,97,114],"113":[],"114":[],"115":[113,97,114,116,117],"116":[],"117":[],"118":[98]};

//        basegraph = {1:[2,3,4], 2:[3,4], 3:[], 4:[], 5:[1], 6:[2]};
        var id;
        for(id in basegraph) {
            basegraph[id] = {
                id: id,
                force: {x:0,y:0},
                velocity: {x:Math.random() - 0.5, y:Math.random() - 0.5},
                pos: {
                    x: Math.random(),
                    y: Math.random()},
                children: basegraph[id]
            };
        }
        var graph = [];
        Object.keys(basegraph).forEach(function(id) {
            basegraph[id].children = basegraph[id].children.map(function(child) { return basegraph[child]; });
            graph.push(basegraph[id]);
        });
        console.log(graph);

        function vsub(a,b) {
            return { x: a.x-b.x, y: a.y-b.y};
        }
        function vadd(a,b) {
            return { x: a.x+b.x, y: a.y+b.y};
        }
        function vscale(k,a) {
            return {x: a.x*k, y: a.y*k};
        }
        function dot(a,b) {
            return a.x*b.x + a.y*b.y;
        }
        function vlen(v) {
            return Math.sqrt(v.x*v.x+v.y*v.y);
        }
        function norm(v) {
            var l = vlen(v);
            return { x: v.x/l, y:v.y/l};
        }
        function dist(a,b) {
            var t = vsub(a,b);
            return Math.sqrt(dot(t,t));
        }
        function vneg(v) {
            return {x:-v.x, y:-v.y};
        }
        var timestep = 0.03;
        var dampening = 0.3;
        var spring = 100;
        var repuls = 100;
        function run() {
            timestep = 0.03;//*Math.random() * Math.random();
            // ### Calculate force
            graph.forEach(function(elem) {
                elem.force = {x:0,y:0};
            });
            var a = graph[0];
            graph.forEach(function(a) {
                a.children.forEach(function(b) {
                    var force = vscale(spring, vsub(b.pos, a.pos));
                    a.force = vadd(a.force, force);
                    b.force = vadd(b.force, vneg(force));
                });
            });
            
            graph.forEach(function(a) {
                graph.forEach(function(b) {
                    if(a.id !== b.id) {
                        var v = norm(vsub(a.pos, b.pos));
                        var d = dist(b.pos, a.pos);
                        if(d < Math.PI/2){
                            a.force = vadd(a.force, vscale(Math.cos(d), v));
                        }
                    }
                });
            });

            // ### Calculate velocity
            graph.forEach(function(elem) {
                elem.velocity = vscale(dampening, vadd(elem.velocity, vscale(timestep, elem.force)));
            });
            // ### Calculate position
            graph.forEach(function(elem) {
                elem.pos = vadd(elem.pos, vscale(timestep, elem.velocity));
            });
            // ### Blit and repeat
            drawGraph();
            if(running) {
                setTimeout(run, 0);
            }
        }
        run();

        function drawGraph() {
            var minx = Math.min.apply(undefined, graph.map(function(e) { return e.pos.x; }));
            var miny = Math.min.apply(undefined, graph.map(function(e) { return e.pos.y; }));
            var maxx = Math.max.apply(undefined, graph.map(function(e) { return e.pos.x; }));
            var maxy = Math.max.apply(undefined, graph.map(function(e) { return e.pos.y; }));

            var ctx = canvas.getContext('2d');

            function transform(a) {
                return {
                    x: (a.x-minx)/(maxx-minx) * canvas.width,
                    y: (a.y-miny)/(maxy-miny) * canvas.height
                };
            }

            ctx.clearRect(0,0,canvas.width, canvas.height);
            ctx.beginPath();
            function line(a,b) {
                var p1 = transform(a);
                ctx.moveTo(p1.x, p1.y);
                var p2 = transform(b);
                ctx.lineTo(p2.x, p2.y);
            }
            graph.forEach(function(a) {
                a.children.forEach(function(b) {
                    line(a.pos,b.pos);
                });
            });
            ctx.stroke();
            ctx.fillText(JSON.stringify({minx:minx,maxx:maxx,miny:miny,maxy:maxy}), 0,20);
            ctx.fillText(JSON.stringify(graph.map(function(b){return dist(graph[0].pos, b.pos);})), 0,40);
        }
    },
    stop: function() {
        running = false;
    }
};

