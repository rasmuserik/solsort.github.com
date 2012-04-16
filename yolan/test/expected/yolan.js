var fs = require.call(null, "fs");

var syntax = require.call(null, "./syntax");

var jsBackend = require.call(null, "./jsBackend");

var action = process["argv"][2];

if (action === "compile") {
    fs.readFile(process["argv"][3], "utf8", function(err, data) {
        if (err) {
            return err;
        }
        var js = jsBackend.toJS(syntax.parse(syntax.tokenize(data)));
        var uglify = require.call(null, "uglify-js");
        var jsp = uglify["parser"];
        var pro = uglify["uglify"];
        var ast = jsp.parse(js);
        js = pro.gen_code(ast, {
            beautify: true
        });
        return fs.writeFile(process["argv"][4], js, function(err, data) {
            if (err) {
                return err;
            }
            return true;
        });
    });
}

if (action === "prettyprint") {
    fs.readFile(process["argv"][3], "utf8", function(err, data) {
        if (err) {
            return err;
        }
        var ast = syntax.parse(syntax.tokenize(data));
        var src = ast.slice(1).map(syntax["prettyprint"]).join("\n\n");
        return fs.writeFile(process["argv"][4], src, function(err, data) {
            if (err) {
                return err;
            }
            return true;
        });
    });
}

if (action === "test") {
    console.log("hello world");
}