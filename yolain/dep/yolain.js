yolain = {};

var engine = undefined;

if (!(typeof process === "undefined")) {
    engine = "node";
} else {}

if (!(typeof java === "undefined")) {
    engine = "rhino";
} else {}

if (!(typeof navigator === "undefined")) {
    engine = "browser";
    var modules = {};
    var require = function(name) {
        return modules[name];
    };
    window["define"] = function(name, dep, f) {
        var module = {};
        var exports = {};
        module["exports"] = exports;
        f.call(null, require, exports, module);
        return modules[name] = module["exports"];
    };
    window["require"] = require;
} else {}

yolain["engine"] = engine;

if (typeof console === "undefined") {
    console = {};
    console["log"] = function() {
        return undefined;
    };
    if (!(typeof print === "undefined")) {
        console["log"] = print;
    } else {}
} else {}

if (!yolain["engine"]) {
    console.log("Error detecting engine:");
} else {}

var run = function(args) {
    var moduleName = args[0] || engine + "-run";
    return module.require("./" + moduleName)["run"].apply(null, args.slice(1));
};

yolain["run"] = run;

if (!(typeof module === "undefined")) {
    module["exports"] = yolain;
} else {}

if (engine === "node") {
    yolain.run(process["argv"].slice(2));
} else {}