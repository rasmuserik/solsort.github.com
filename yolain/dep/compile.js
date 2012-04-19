var fs = module.require("fs");

var syntax = module.require("./syntax");

var jsBackend = module.require("./jsBackend");

var ilBackend = module.require("./ilBackend");

var action = process["argv"][2];

exports["sourceFiles"] = fs.readdirSync("src").filter(function(name) {
    return name.slice(-3) === ".yl";
});

var mtime = function(fname) {
    try {
        return fs.statSync(fname)["mtime"].getTime();
    } catch (e) {
        return 0;
    }
    return 0;
};

exports["run"] = function() {
    return exports["sourceFiles"].forEach(function(f) {
        var src = "src/" + f;
        var dest = "build/" + f.slice(0, -2) + "js";
        if (mtime.call(null, dest) < mtime.call(null, src)) {
            compile.call(null, src, dest);
        } else {}
        return undefined;
    });
};

var compile = function(src, dest) {
    return fs.readFile(src, "utf8", function(err, data) {
        if (err) {
            return err;
        } else {}
        var js = jsBackend.toJS(syntax.parse(syntax.tokenize(data)));
        var uglify = require.call(null, "uglify-js");
        var jsp = uglify["parser"];
        var pro = uglify["uglify"];
        var ast = jsp.parse(js);
        js = pro.gen_code(ast, {
            beautify: true
        });
        return fs.writeFile(dest, js, function(err, data) {
            if (err) {
                return err;
            } else {
                console.log(src, "->", dest);
            }
            return true;
        });
    });
};