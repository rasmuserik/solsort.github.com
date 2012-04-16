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
            return exports.toJS(pair[0]) + ":" + exports.toJS(pair[1]);
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
    quote: function(syn, syn1) {
        return JSON.stringify(syn1);
    }
};

exports["toJS"] = function(syn) {
    var syn0 = syn[0];
    var syn1 = syn[1];
    var syn2 = syn[2];
    if (typeof syn === "string") {
        return syn;
    } else if (compileJS[syn0]) {
        return compileJS[syn0].call(null, syn, syn1);
    } else if (syn1 === "set") {
        return exports.toJS(syn0) + "[" + exports.toJS(syn2) + "]=" + exports.toJS(syn[3]);
    } else if (syn1 === "+") {
        return "(" + [ exports.toJS(syn0) ].concat(syn.slice(2).map(exports["toJS"])).join("+") + ")";
    } else if (syn1 === "-") {
        return "(" + [ exports.toJS(syn0) ].concat(syn.slice(2).map(exports["toJS"])).join("-") + ")";
    } else if (syn1 === "and") {
        return "(" + [ exports.toJS(syn0) ].concat(syn.slice(2).map(exports["toJS"])).join("&&") + ")";
    } else if (syn1 === "or") {
        return "(" + [ exports.toJS(syn0) ].concat(syn.slice(2).map(exports["toJS"])).join("||") + ")";
    } else if (syn1 === "==") {
        return "(" + exports.toJS(syn0) + "===" + exports.toJS(syn2) + ")";
    } else if (syn1 === "<") {
        return "(" + exports.toJS(syn0) + "<" + exports.toJS(syn2) + ")";
    } else if (syn1 === "<=") {
        return "(" + exports.toJS(syn0) + "<=" + exports.toJS(syn2) + ")";
    } else if (syn1 === "fails") {
        return "!(" + exports.toJS(syn0) + ")";
    } else if (syn1 === "get") {
        return exports.toJS(syn0) + "[" + exports.toJS(syn2) + "]";
    } else if (typeof syn0 === "string") {
        return exports.toJS(syn0) + "." + syn1 + "(" + syn.slice(2).map(exports["toJS"]).join(",") + ")";
    }
    return exports.toJS(syn0) + "." + syn1 + "(" + syn.slice(2).map(exports["toJS"]).join(",") + ")";
};