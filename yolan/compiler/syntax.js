var tokenRegEx = RegExp.call(RegExp, "\\s*(\\[|\\]|(\\\\.|[^\\s\\[\\]])+)", "g");

var unescapeRegEx = RegExp.call(RegExp, "\\\\(.)", "g");

var escapeRegEx = RegExp.call(RegExp, "[\\\\\\[\\] \\n\\r]", "g");

var exports = {};

exports.tokenize = function(str) {
    var result = [];
    str.replace(tokenRegEx, function(_, token) {
        return result.push(token);
    });
    return result;
};

exports.parse = function(tokens) {
    tokens = tokens.reverse();
    var stack = [];
    var current = [ "do" ];
    while (tokens["length"]) {
        var token = tokens.pop();
        if (token === "[") {
            stack.push(current);
            current = [];
        } else if (token === "]") {
            var t = current;
            current = stack.pop();
            current.push(t);
        } else if (true) {
            current.push(token.replace(unescapeRegEx, function(_, a) {
                return a;
            }));
        }
    }
    return current;
};

exports.nspace = function(n) {
    var result = [];
    while (0 < n) {
        n = n - 1;
        result.push(" ");
    }
    return result.join("");
};

var indent = 0;

var screenWidth = 78;

var indentStep = 2;

exports.prettyprint = function(ast) {
    if (typeof ast === "string") {
        return ast.replace(escapeRegEx, function(s) {
            return "\\" + s;
        });
    }
    if (0 === ast["length"]) {
        return "[]";
    }
    indent = indent + indentStep;
    var pos = indent;
    strs = ast.map(exports["prettyprint"]);
    if (pos + strs.join()["length"] + 1 < screenWidth) {
        indent = indent - indentStep;
        return "[" + strs.join(" ") + "]";
    }
    var space = "\n" + exports.nspace(indent);
    var result = [];
    result.push("[");
    result.push(strs[0]);
    pos = pos + strs[0]["length"] + 1;
    var i = 1;
    var forceNewLine = false;
    var currentIsString = true;
    while (i < ast["length"]) {
        var prevIsString = currentIsString;
        currentIsString = typeof ast[i] === "string";
        forceNewLine = false;
        if (!prevIsString || !currentIsString) {
            forceNewLine = true;
        }
        if (i < 2) {
            forceNewLine = false;
        }
        var prevIsString = currentIsString;
        result.push(" ");
        if (forceNewLine || screenWidth < pos + strs[i]["length"]) {
            result.pop();
            result.push(space);
            pos = indent;
        }
        result.push(strs[i]);
        pos = pos + strs[i]["length"] + 1;
        i = i + 1;
    }
    result.push("]");
    indent = indent - indentStep;
    return result.join("");
};

var compileJS = {
    JsTypeOf: function(syn, syn1) {
        return "typeof " + exports.toJS(syn1);
    },
    "do": function(syn) {
        return syn.slice(1).map(exports["toJS"]).join(";");
    },
    def: function(syn, syn1) {
        return "var " + syn1 + "=" + exports.toJS(syn[2]);
    },
    set: function(syn, syn1) {
        return syn1 + "=" + exports.toJS(syn[2]);
    },
    object: function(syn, syn1) {
        return "{" + syn.slice(1).map(function(pair) {
            return JSON.stringify(pair[0].toString()) + ":" + exports.toJS(pair[1]);
        }).join(",") + "}";
    },
    array: function(syn, syn1) {
        return "[" + syn.slice(1).map(exports["toJS"]).join(",") + "]";
    },
    fn: function(syn, syn1) {
        return "function(" + syn1.join(",") + "){" + syn.slice(2, -1).map(exports["toJS"]).join(";") + ";return " + exports.toJS(syn[syn["length"] - 1]) + "}";
    },
    "while": function(syn, syn1) {
        return "while(" + exports.toJS(syn1) + "){" + syn.slice(2).map(exports["toJS"]).join(";") + "}";
    },
    cond: function(syn) {
        return syn.slice(1).map(function(pair) {
            return "if(" + exports.toJS(pair[0]) + "){" + pair.slice(1).map(exports["toJS"]).join(";") + "}";
        }).join("else ");
    },
    "if": function(syn, syn1) {
        return "if(" + exports.toJS(syn1) + "){" + syn.slice(2).map(exports["toJS"]).join(";") + "}";
    },
    "#": function() {
        return "";
    },
    "return": function(syn, syn1) {
        return "return " + exports.toJS(syn1);
    },
    "throw": function(syn, syn1) {
        return "throw " + exports.toJS(syn1);
    },
    "+": function(syn) {
        return syn.slice(1).map(exports["toJS"]).join("+");
    },
    "-": function(syn) {
        return syn.slice(1).map(exports["toJS"]).join("-");
    },
    and: function(syn) {
        return syn.slice(1).map(exports["toJS"]).join("&&");
    },
    or: function(syn) {
        return syn.slice(1).map(exports["toJS"]).join("||");
    },
    not: function(syn, syn1) {
        return "!" + exports.toJS(syn1);
    },
    "<": function(syn, syn1) {
        return exports.toJS(syn1) + "<" + exports.toJS(syn[2]);
    },
    "<=": function(syn, syn1) {
        return exports.toJS(syn1) + "<=" + exports.toJS(syn[2]);
    },
    "eq?": function(syn, syn1) {
        return exports.toJS(syn1) + "===" + exports.toJS(syn[2]);
    }
};

exports.toJS = function(syn) {
    var syn0 = syn[0];
    var syn1 = syn[1];
    if (typeof syn === "string") {
        return syn;
    } else if (compileJS[syn0]) {
        return compileJS[syn0].call(null, syn, syn1);
    } else if (syn1 === "set") {
        return exports.toJS(syn0) + "." + syn[2] + "=" + exports.toJS(syn[3]);
    } else if (syn1 === "get") {
        return exports.toJS(syn0) + "[" + exports.toJS(syn[2]) + "]";
    } else if (typeof syn0 === "string") {
        return exports.toJS(syn0) + "." + syn1 + "(" + syn.slice(2).map(exports["toJS"]).join(",") + ")";
    }
    return exports.toJS(syn0) + "." + syn1 + "(" + syn.slice(2).map(exports["toJS"]).join(",") + ")";
};

var fs = require.call(null, "fs");

var action = process["argv"][2];

if (action === "compile") {
    fs.readFile(process["argv"][3], "utf8", function(err, data) {
        if (err) {
            return err;
        }
        var js = exports.toJS(exports.parse(exports.tokenize(data)));
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
        var ast = exports.parse(exports.tokenize(data));
        var src = ast.slice(1).map(exports["prettyprint"]).join("\n\n");
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