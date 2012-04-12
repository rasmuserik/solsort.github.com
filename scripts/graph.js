// # Spring-based graph layout
// This is experimental code, not really intended for reading yet.
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
        var i;
        for(i = 0; i <100; ++i) {
            basegraph[i] = [];
            //while(i>4 && Math.random() < 0.2) {basegraph[i-2-Math.random() * Math.random()*(i-2)|0].push(i);}
            basegraph[Math.random() *i|0].push(i);
        }
        for(i=0;i<99;++i) {
            if(Math.random() < 0.2) {
                basegraph[i].push(i+1);
            }
        }
        //basegraph = {"?Gårdmand1":["Rasmus2"],"Rasmus2":["Ruth100","Alice101","Ellen102"],"adolf3":["Ingrid4","Helen5","Erling6"],"Ingrid4":["Michal69","eyal46","amnon70","eytan48","Joav71"],"Helen5":["mirah59","benny60"],"Erling6":[],"Anders7":["Elsebeth8"],"Elsebeth8":["Bodil19","Ib31","Gunnar32","Karsten33"],"Ane9":["Rasmus2"],"Anne10":["kat11","km12","johan13","Jakob14"],"kat11":[],"km12":[],"johan13":[],"Jakob14":[],"Bettina15":["Theodor16"],"Theodor16":[],"Bianca17":["Harald18"],"Harald18":["Eivig30"],"Bodil19":["Elsebeth20","Jens21","Niels22"],"Elsebeth20":["Maja41"],"Jens21":[],"Niels22":["kat11","km12","johan13","Jakob14","Rasmus89"],"effi23":["inger24","herluf25","Anne26","hans27","mille28"],"inger24":[],"herluf25":["irene62"],"Anne26":[],"hans27":[],"mille28":[],"effiparent29":["adolf3","effi23"],"Eivig30":["Bodil19","Ib31","Gunnar32","Karsten33"],"Ib31":["Dorthe50","Lisbeth51","Marianne52","Henrik53"],"Gunnar32":[],"Karsten33":["Bodil64","Michael65","Susanne66"],"Ejlif34":["MariAnne35","Kirsten36"],"MariAnne35":["Rasmus89"],"Kirsten36":[],"Elisabeth37":["Jensine38"],"Jensine38":["Harry54"],"Elsebeth39":["Pauline40"],"Pauline40":["Elsebeth8"],"Maja41":[],"elsemarie42":["sarah43","simon44","jakob45"],"sarah43":[],"simon44":[],"jakob45":[],"eyal46":["samuel47"],"samuel47":[],"eytan48":["sarah43","simon44","jakob45"],"Grethe49":["Dorthe50","Lisbeth51","Marianne52","Henrik53"],"Dorthe50":[],"Lisbeth51":[],"Marianne52":[],"Henrik53":[],"Harry54":["Elsebeth20","Jens21","Niels22"],"heinz55":["Rafi56","banini57","giddi58"],"Rafi56":["Michal69","eyal46","amnon70","eytan48","Joav71"],"banini57":[],"giddi58":[],"mirah59":[],"benny60":[],"helmuth61":["mirah59","benny60"],"irene62":["lisa72","melany73","angelica74"],"Hildegard63":["Bodil64","Michael65","Susanne66"],"Bodil64":[],"Michael65":[],"Susanne66":[],"Inger67":["Anne68"],"Anne68":[],"Michal69":["Noam91","imbal92","gallia93","shahar94"],"amnon70":[],"Joav71":["Bettina15"],"lisa72":[],"melany73":[],"angelica74":[],"Jens75":["Ejlif34","Sven76","Peder77","Inger67"],"Sven76":["Michael90","Jens110"],"Peder77":[],"Jørgen78":["Therkel79"],"Therkel79":["Harry54"],"Karen80":["Therkel79"],"kemal81":["minna82","mariarasmussen83"],"minna82":[],"mariarasmussen83":[],"Laura84":["Anders7"],"Marianne85":["Jacob86","Freja87","Cecilie88"],"Jacob86":[],"Freja87":[],"Cecilie88":[],"Rasmus89":["Theodor16"],"Michael90":["Jacob86","Freja87","Cecilie88"],"Noam91":[],"imbal92":[],"gallia93":[],"shahar94":[],"monica95":["samuel47"],"motti96":["Noam91","imbal92","gallia93","shahar94"],"nina97":["Bettina15","minna82","mariarasmussen83"],"Nina98":["Ejlif34","Sven76","Peder77","Inger67"],"Oda99":["Ruth100","Alice101","Ellen102"],"Ruth100":["MariAnne35","Kirsten36"],"Alice101":[],"Ellen102":[],"Peter103":["Pauline40"],"Rasmus104":["Harald18"],"Rasmus105":["Anders7"],"Rasmus106":["Søren107"],"Søren107":["Jensine38"],"ruth108":["Rafi56","banini57","giddi58"],"Svend109":["Jens75"],"Jens110":[],"Thora111":["Eivig30"],"tovehedvig112":["jan113","nina97","hanne114"],"jan113":[],"hanne114":[],"verner115":["jan113","nina97","hanne114","?verner116","?verner117"],"?verner116":[],"?verner117":[],"Æ118":["Nina98"]};
        basegraph = {}; for(var x=0;x<6;++x) { for(var y=0;y<6;++y) { if(y===5 || x === 5) { if(y!==x) { basegraph[x+','+y] = []; } } else { basegraph[x+','+y] = [(x+1)+','+y, x+','+(y+1)]; } } }
        for(i = 0; i <40; ++i) {
            basegraph[i] = [];
            basegraph[Math.random() *i|0].push(i);
        }
        basegraph[0].push('0,0');


        //basegraph=[]; for(i = 0; i <20; ++i) { basegraph[i] = []; for(var j=0; j <i; ++j) { basegraph[j].push(i); } }
        //basegraph = {1:[2,3,4], 2:[3,4], 3:[], 4:[], 5:[1], 6:[2]};
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
        var spring = 10000;
        var repuls = 1000;
        var passt = 0;
        var gnum;
        var timestep = 0.005;
        var dampening = 0.99;
        function run() {
            if(passt > 0) {
                passt -= 0.01;
            }

            // ### Calculate force
            graph.forEach(function(elem) {
                elem.force = {x:0,y:0};
            });

            graph.forEach(function(a) {
                a.children.forEach(function(b) {
                    var doit = Math.random()*Math.random()*4 > passt;
                    if(doit) {
                    var v = vsub(b.pos, a.pos);
                    var force = vscale(spring*0.1*Math.min(vlen(v), 100), v);
                    a.force = vadd(a.force, force);
                    b.force = vadd(b.force, vneg(force));
                    }
                });
            });
          
            var doit = Math.random() * Math.random()*2 > passt;
            graph.forEach(function(a) {
                graph.forEach(function(b) {
                    if(a.id !== b.id && doit) {
                        var v = norm(vsub(a.pos, b.pos));
                        var d = dist(b.pos, a.pos);
                        if(d < Math.PI/2){
                            a.force = vadd(a.force, vscale(repuls*Math.cos(d), v));
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
                var rescale = vlen(elem.velocity);
                elem.pos = vadd(elem.pos, vscale(timestep/Math.sqrt(1+rescale), elem.velocity));
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
                ctx.lineWidth = 3;
                var p1 = transform(a);
                ctx.moveTo(p1.x, p1.y);
                var p2 = transform(b);
                ctx.lineTo(p2.x, p2.y);
            }
            function dot(a) {
                var p = transform(a.pos);
                var sz = 24;
                ctx.lineWidth = 1;
                ctx.strokeRect(p.x-sz, p.y-sz, sz*2, sz*2);
                ctx.fillStyle = 'rgba(255,255,255,.7)';
                ctx.fillRect(p.x-sz+1, p.y-sz+1, sz*2-2, sz*2-2);
                ctx.fillStyle = '#000';
                ctx.fillText(a.id, p.x-17,p.y);
            }
            graph.forEach(function(a) {
                a.children.forEach(function(b) {
                        line(a.pos,b.pos);
                });

            });
            ctx.stroke();
            graph.forEach(function(a) {
                dot(a);
            });
            ctx.fillText(passt, 0,20);
            //ctx.fillText(JSON.stringify(graph.map(function(b){return dist(graph[0].pos, b.pos);})), 0,40);
        }
    },
    stop: function() {
        running = false;
    }
};

