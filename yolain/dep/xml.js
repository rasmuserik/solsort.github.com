exports["fromYolain"] = function(xml) {
    if (typeof xml === "string") {
        return xml;
    } else {}
    xml = xml.slice(0);
    var tagname = xml.shift();
    var attr = [];
    var attrData = xml[0];
    if (attrData && Array.isArray(attrData[0])) {
        attr = attrData;
        xml.shift();
    } else {}
    var content = xml.map(exports["fromYolain"]).join(" ");
    var attrStr = attr.map(function(attr) {
        return " " + attr[0] + '="' + attr.slice(1).join(" ") + '"';
    }).join("");
    if (content) {
        return "<" + tagname + attrStr + ">" + content + "</" + tagname + ">";
    } else {}
    return "<" + tagname + attrStr + "/>";
};