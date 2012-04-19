var fs = module.require("fs");

var syntax = module.require("./syntax");

var jsBackend = module.require("./jsBackend");

var ilBackend = module.require("./ilBackend");

var action = process["argv"][2];

if (action === "toJavaScript") {
    fs.readFile(process["argv"][3], "utf8", function(err, data) {
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
        return fs.writeFile(process["argv"][4], js, function(err, data) {
            if (err) {
                return err;
            } else {}
            return true;
        });
    });
} else {}

if (action === "toIntermediateLanguage") {
    fs.readFile(process["argv"][3], "utf8", function(err, data) {
        if (err) {
            return err;
        } else {}
        var il = ilBackend.toIL(syntax.parse(syntax.tokenize(data)));
        console.log(syntax.prettyprint(il));
        var txt = ilBackend.binaryEncode(il);
        console.log(txt);
        return fs.writeFile(process["argv"][4], txt + "\n", function(err, data) {
            if (err) {
                return err;
            } else {}
            return true;
        });
    });
} else {}

if (action === "prettyprint") {
    fs.readFile(process["argv"][3], "utf8", function(err, data) {
        if (err) {
            return err;
        } else {}
        var ast = syntax.parse(syntax.tokenize(data));
        var src = ast.slice(1).map(syntax["prettyprint"]).join("\n\n");
        return fs.writeFile(process["argv"][4], src, function(err, data) {
            if (err) {
                return err;
            } else {}
            return true;
        });
    });
} else {}

if (action === "transform") {
    fs.readFile(process["argv"][3], "utf8", function(err, data) {
        if (err) {
            return err;
        } else {}
        var ast = syntax.parse(syntax.tokenize(data));
        ast = module.require("./transform").transform(ast);
        var src = ast.slice(1).map(syntax["prettyprint"]).join("\n\n");
        return fs.writeFile(process["argv"][4], src, function(err, data) {
            if (err) {
                return err;
            } else {}
            return true;
        });
    });
} else {}

if (action === "test") {
    console.log("hello world");
} else {}