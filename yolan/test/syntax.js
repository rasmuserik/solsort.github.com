var tokenRegEx = RegExp.call(RegExp, "\\s*(\\[|\\]|(\\\\.|[^\\s\\[\\]])+)", "g");

var unescapeRegEx = RegExp.call(RegExp, "\\\\(.)", "g");

var escapeRegEx = RegExp.call(RegExp, "[\\\\\\[\\] \\n\\r]", "g");

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