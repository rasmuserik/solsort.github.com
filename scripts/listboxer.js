var tree;
exports.app = {
    underbar: true,
    type: 'canvas',
    start: function() {
        var canvas = this.elem;
        canvas.height = this.$.height();
        canvas.width = this.$.width();

        var ctx = canvas.getContext('2d');

        treeParent(tree);

        function treeParent(tree, prev) {
            if(Array.isArray(tree)) {
                tree.parent = prev;
                tree.forEach(function(subtree) { treeParent(subtree, tree); });
            }
        }


        var textsize = 14;
        ctx.font = textsize+'px sans-serif';
        ctx.lineWidth = 1;
        ctx.textBaseline= 'baseline';
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawBox({val: tree, x: 0, y: 0, w: canvas.width, h: canvas.height});
        //drawBox({val: ['hello world', ['aoo', 'bar', ['baz']], ['boo', 'bar', ['baz'], ['coo', 'bar', ['baz'], ['doo', 'bar', ['baz']], ['eoo', 'bar', ['baz']]]], ['foo', 'bar', ['baz']]], x: 0.5, y: 0.5, w: canvas.width-1, h: canvas.height-1});

        function drawBox(obj) {
            //console.log('drawBox', obj);
            var w = obj.w;
            var h = obj.h;
            var x = obj.x;
            var y = obj.y;
            //console.log('y0:', y);
            var val = obj.val;
            var size = lineSize(obj.val, obj.w);
            if(Array.isArray(val)) {
                ctx.fillStyle = '#' + (0xf0f0f0 | Math.random() * 0x1000000).toString(16);
                ctx.fillStyle = '#fff';
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = '#000';
                ctx.fillStyle = '#' + ((0xffffff & Math.random() * 0x1000000)+0x1000000).toString(16).slice(1);
                //ctx.fillRect(x, y, w, 1);
                ctx.fillRect(x, y, 10, 1);
                ctx.fillRect(x, y+h-1, 10, 1);
                ctx.fillRect(x, y, 1, h);
                ctx.fillStyle = '#fff';
                //ctx.fillRect(x, y+h, w, 1);
                //ctx.fillRect(x+w, y, 1, h);
                ctx.fillStyle = '#000';
                x += 4; y += 3; h -= 6; w-= 4;
                var x1 = x + 8;
                var w1 = x + 8;
                for(var i = 0; i < val.length; ++i) {
                    var childSize = boxSize(val[i], w);
                    var child = {
                            x: x,
                            y: y,
                            h: childSize.h,
                            w: w,
                            val: val[i] };
                    //console.log('child', child);
                    if(childSize.w < w) {
                        drawLine(child);
                    } else {
                        drawBox(child);
                    }
                    //w = w1; x = x1;
                    //console.log('y1:', y);
                    y += childSize.h + 2;
                    //console.log('y2:', y, childSize);
                }
                return;
            }
            ctx.fillText(val, x, y + textsize);
        }
        function boxSize(obj, w) {
            var line = lineSize(obj);
            if(Array.isArray(obj)) {
                if(obj.boxSize) {
                    return obj.boxSize;
                }
                if(line.w > w && Array.isArray(obj)) {
                    var h = 2;
                    for(var i = 0; i < obj.length; ++i) {
                        h += boxSize(obj[i], w - 4).h + 2;
                    }
                    obj.boxSize = {w : w, h: h+4};
                } else {
                    obj.boxSize = line;
                }
                return obj.boxSize;
            }
            return line;
        }
        
        function drawLine(obj) {
            //console.log('drawLine',(obj));
            var size = lineSize(obj.val);
            var x = obj.x;
            var y = obj.y;
            var h = obj.h;
            var val = obj.val;
            y = y + (h - size.h);
            h = size.h;
            var w = size.w;
            if(Array.isArray(val)) {
                ctx.fillStyle = '#' + (0xf0f0f0 | Math.random() * 0x1000000).toString(16);
                ctx.fillStyle = '#fff';
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = '#000';
                ctx.fillStyle = '#' + ((0xffffff & Math.random() * 0x1000000)+0x1000000).toString(16).slice(1);
                ctx.fillRect(x, y+h, w, 1);
                ctx.fillRect(x+w-1, y+h-textsize/2, 1, textsize/2);
                ctx.fillRect(x, y+h-textsize/2, 1, textsize/2);
                ctx.fillStyle = '#fff';
                //ctx.fillRect(x+w, y, 1, h);
                ctx.fillStyle = '#000';
                x += 1; y += 0; h -= 3;
                var pos = 2;
                ++x;
                for(var i = 0; i < val.length; ++i) {
                    var child = val[i];
                    var childsize = lineSize(val[i]);
                    drawLine({val: child,
                            x: x, y: y, h: h});
                    x += childsize.w + 3;
                }
                return;
            }
            if(true || typeof val === 'string') {
                ctx.fillText(val, x, y + textsize);
                return;
            }
            throw 'wrong type';
        }
        function lineSize(val) {
            //console.log('lineSize', val);
            if(!Array.isArray(val)) {
                val = '' + val;
            }

            if(typeof val === 'string') {
                return {
                    w: ctx.measureText(val).width,
                    h: textsize
                };
            }
            if(val.lineSize) {
                return val.lineSize;
            }
            if(Array.isArray(val)) {
                var w = 1;
                var h = textsize;
                for(var i = 0; i < val.length; ++i) {
                    var size = lineSize(val[i]);
                    w += size.w + 3;
                    h = Math.max(h, size.h + 3);
                }
                val.lineSize = {w: w, h: h};
                return val.lineSize;
            }
            throw 'wrong type';
        }
    },
    stop: function() {
        tree = undefined;
    }
};
tree = ["do",["def","tokenRegEx",["RegExp","call","RegExp",["\"","\\\\s*(\\\\\\[|\\\\\\]|(\\\\\\\\.|\\[^\\\\s\\\\\\[\\\\\\]\\])+)"],["\"","g"]]],["def","unescapeRegEx",["RegExp","call","RegExp",["\"","\\\\\\\\(.)"],["\"","g"]]],["def","yolan",["object"]],["yolan","set","tokenize",["fn",["str"],["def","result",["array"]],["str","replace","tokenRegEx",["fn",["_","token"],["result","push","token"]]],["return","result"]]],["yolan","set","parse",["fn",["tokens"],["set","tokens",["tokens","reverse"]],["def","stack",["array"]],["def","current",["array",["\"","do"]]],["while",["tokens","get","length"],["def","token",["tokens","pop"]],["cond",[["token","===",["\"","\\["]],["stack","push","current"],["set","current",["array"]]],[["token","===",["\"","\\]"]],["def","t","current"],["set","current",["stack","pop"]],["current","push","t"]],["true",["current","push","token"]]]],["return","current"]]],[["require","call","null",["\"","fs"]],"readFile",["\"","yolan.yl"],["\"","utf8"],["fn",["err","data"],["#","console","log",["JSON","stringify",["yolan","tokenize","data"]]],["#","console","log",["yolan","parse",["yolan","tokenize","data"]]],["console","log",["JSON","stringify",["yolan","parse",["yolan","tokenize","data"]]]]]]];
