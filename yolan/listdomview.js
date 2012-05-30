define("./listdomview",["require","exports","module"],function(require,exports,module){var htmlView=exports;
var yolan=module.require("./yolan");
var syntax=module.require("./syntax");
var webcolor=module.require("./webcolor");
var test=module.require("./test");
exports["randomColor"]=function(elem,str){
var style=elem["style"];
style["backgroundColor"]=webcolor.hashLightColor(str);
style["borderColor"]=webcolor.hashColor(str)
};
exports["newElem"]=function(elemType,text){
var elem=document.createElement(elemType);
elem.appendChild(document.createTextNode(text));
return elem
};
exports["style2css"]=function(style){
var keys=Object.keys(style);
var result=[];
var i=0;
while((i<keys["length"])){
var key=keys[i];
result.push(".");
result.push(key);
result.push("{");
result.push(style[key].map(function(elem){
return (elem[0]+":"+elem.slice(1).join(" "))
}).join(";"));
result.push("}\n");
i=(i+1)
};
return result.join("")
};
exports["init"]=function(){
var style={
"cursor":[["border",".3em","solid","red"],["border-radius",".9em"]],"listAtom":[["margin","0em",".0em","0em",".0em"],["background-color","rgba(255,255,255,0.5)"],["border-radius",".3em"],["white-space","pre-wrap"],["font-family","sans-serif"]],"list":[["padding",".1em",".1em",".1em",".2em"],["margin",".1em",".1em",".1em",".1em"],["display","inline-block"],["xborder-radius",".3em"],["border","2px","solid"],["xbox-shadow",".2em",".2em",".6em","rgba(0,0,0,.4)"]]
};
document.getElementsByTagName("head")[0].appendChild(exports.newElem("style",exports.style2css(style)))
};
var curPos=0;
exports["scrollToCursor"]=function(){
var running=false;
return function(){
if(running){
return 
}else{

};
var pos=cursorNode.getBoundingClientRect();
var cursorMargin=(window["innerHeight"]/5);
if(((pos["top"]<(0+cursorMargin))||((window["innerHeight"]-cursorMargin)<pos["bottom"]))){
window.setTimeout(function(){
var desiredPos=(curPos+(pos["top"]-(window["innerHeight"]/2)));
var nextPos=((curPos*.95)+(desiredPos*.05));
window.scrollTo(0,nextPos);
curPos=nextPos
},0);
window.setTimeout(htmlView["scrollToCursor"],10);
running=true
}else{

};
running=false
}
}.call();
var cursorNode=undefined;
exports["update"]=function(obj){
if(!(cursorNode)){
cursorNode=document.createElement("span");
cursorNode["className"]="cursor";
cursorNode.appendChild(document.createTextNode("|"))
}else{

};
var elem=obj["elem"];
if(!(elem)){
elem=document.createElement("span");
obj["elem"]=elem
}else{

};
if(obj["value"]){
elem["className"]="listAtom";
while(elem.hasChildNodes()){
elem.removeChild(elem["lastChild"])
};
if(!((obj["cursor"]===undefined))){
elem.appendChild(document.createTextNode(JSON.stringify(obj["value"].slice(0,obj["cursor"])).slice(1,-1)));
elem.appendChild(cursorNode);
htmlView.scrollToCursor();
elem.appendChild(document.createTextNode(JSON.stringify(obj["value"].slice(obj["cursor"])).slice(1,-1)))
}else{
elem.appendChild(document.createTextNode(JSON.stringify(obj["value"]).slice(1,-1)))
}
}else{
elem["className"]="list";
while(elem.hasChildNodes()){
elem.removeChild(elem["lastChild"])
};
var text="undefined";
if((obj["children"]&&obj["children"][0]&&obj["children"][0]["value"])){
text=obj["children"][0]["value"]
}else{

};
exports.randomColor(elem,text);
var i=0;
var len=obj["children"]["length"];
while((i<len)){
if(i){
elem.appendChild(document.createTextNode(" "))
}else{

};
if((!((obj["cursor"]===undefined))&&(obj["cursor"]===i))){
elem.appendChild(cursorNode);
htmlView.scrollToCursor();
elem.appendChild(document.createTextNode(" "))
}else{

};
if(!(obj["children"][i]["elem"])){
htmlView.update(obj["children"][i])
}else{

};
elem.appendChild(obj["children"][i]["elem"]);
i=(i+1)
};
if((!((obj["cursor"]===undefined))&&(obj["cursor"]===i))){
elem.appendChild(cursorNode);
htmlView.scrollToCursor();
elem.appendChild(document.createTextNode(" "))
}else{

}
};
return obj
}});