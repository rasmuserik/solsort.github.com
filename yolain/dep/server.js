var http = module.require("http");

var fs = module.require("fs");

var syntax = module.require("./syntax");

var jsBackend = module.require("./jsBackend");

var xml = module.require("./xml");

var scriptList = [ "yolain", "webmain" ];

var head = "<!DOCTYPE html><html>" + xml.fromYolain([ "head", [ "title", "Hello", "world" ] ]);

var body = "<body><script>function define(_,_,f){f()};</script>" + scriptList.map(function(name) {
    return '<script src="' + name + '.js"></script>';
}).join("") + '<script>require("./webmain").run();</script>' + "</body></html>";

exports["run"] = function() {
    http.createServer(function(request, result) {
        var url = request["url"];
        console.log(request["url"]);
        if (!(url.slice(-3) === ".js")) {
            result.writeHead(200, {
                "Content-Type": "text/html"
            });
            result.end(head + body);
        } else {}
        if (url.slice(-3) === ".js") {
            result.writeHead(200, {
                "Content-Type": "text/javascript"
            });
            var name = "." + url.slice(0, -3);
            fs.readFile("./src/" + name + ".yl", "utf8", function(err, data) {
                if (err) {
                    result.end("");
                } else {}
                return result.end('define("' + name + '",["require","exports","module"],function(require,exports,module){' + jsBackend.toJS(syntax.parse(syntax.tokenize(data))) + "});");
            });
        } else {}
        return true;
    }).listen(1234, "127.0.0.1");
    return console.log([ "starting", "server", "on", "localhost", "port", "1234" ]);
};