var macros = {};

var onEach = [];

exports["transform"] = function(node) {
    node = onEach.reduce(function(acc, obj) {
        return obj["transform"].call(null, acc);
    }, node);
    if (macros[node[0]]) {
        node = macros[node[0]]["transform"].call(null, node);
    } else {}
    return node;
};

exports["reverse"] = function(node) {
    node = onEach.reverse().reduce(function(acc, obj) {
        return obj["reverse"].call(null, acc);
    }, node);
    node = onEach[Object.keys(onEach).reverse()].reduce(function(acc, obj) {
        return obj["reverse"].call(null, acc);
    }, node);
    return node;
};

macros["if"] = {
    transform: function(node) {
        return [ "if-else", [ "do" ].concat(node.slice(1)) ];
    },
    reverse: function(node) {
        if (node[0] === "if-else" && node["length"] === 2) {
            if (node[1][0] === "do") {
                return [ "if" ].slice(node[1][0].slice(1));
            } else {
                return [ "if", node[1] ];
            }
        } else {}
        return node;
    }
};