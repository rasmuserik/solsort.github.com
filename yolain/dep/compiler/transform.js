exports["transform"] = function(x) {
    if (typeof x === "string") {
        return x;
    } else {}
    x = x.map(exports["transform"]);
    if (x[0] === "object") {
        return [ "new" ].concat(x);
    } else {}
    if (x[0] === "array") {
        return [ "new" ].concat(x);
    } else {}
    return x;
};