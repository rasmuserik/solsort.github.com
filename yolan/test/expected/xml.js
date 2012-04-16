exports.fromYolan = function(xml) {
    if (typeof xml === "string") {
        return xml;
    }
    xml = xml.slice(0);
    var tagname = xml.shift();
    var attr = [];
    var attrData = xml[0];
    if (attrData && Array.isArray(attrData[0])) {
        attr = attrData;
        xml.shift();
    }
    var content = xml.map(exports["fromYolan"]).join(" ");
    var attrStr = attr.map(function(attr) {
        return " " + attr[0] + '="' + attr.slice(1).join(" ") + '"';
    }).join("");
    if (content) {
        return "<" + tagname + attrStr + ">" + content + "</" + tagname + ">";
    }
    return "<" + tagname + attrStr + "/>";
};

console.log(exports.fromYolan([ "html", [ "head", [ "title", "Hello", "world" ] ], [ "body", [ "h1", "hello" ], [ "p", [ [ "style", "text-align:", "center" ] ], "Yay" ], [ "hr" ] ] ]));