define("./listcanvasview",["require","exports","module"],function(require,exports,module){var yolan=module.require("./yolan");
var domview=module.require("./listdomview");
var webcanvas=module.require("./webcanvas");
var wordPad=2;
var listPad=4;
var fontHeight=14;
var fontName=(fontHeight+"px sans-serif");
var root=undefined;
var canvasRef=undefined;
var ctxRef=undefined;
var drawFn=function(ctx,w,h,canvas){
canvasRef=canvas;
ctxRef=ctx;
ctx["fillStyle"]="#fff";
ctx.fillRect(0,100,1000,60);
ctx["fillStyle"]="#000";
exports.calcPos(root,0,0,canvas["width"]);
drawNode.call(null,root);
ctx["font"]=fontName;
ctx.fillText("Hello world",110,110)
};
var drawNode=function(node){
if(node["children"]){
node["children"].map(drawNode)
}else{
ctxRef.fillText(node["value"],node["x"],130)
}
};
exports["init"]=function(rootNode){
root=rootNode;
webcanvas.init({
"update":drawFn
});
exports.update(rootNode);
domview.init()
};
exports["update"]=function(node){
exports.calcWidth(node);
domview.update(node)
};
exports["calcPos"]=function(node,x,y,w){
node["x"]=x;
node["y"]=y;
if(node["children"]){
if(!(node["width"])){
exports.calcWidth(node)
}else{

};
var i=0;
while((i<node["children"]["length"])){
x=(x+(listPad/2));
exports.calcPos(node["children"][i],x,y);
x=(x+node["children"][i]["width"]);
i=(i+1)
}
}else{

}
};
exports["calcWidth"]=function(node){
if(node["width"]){
return node["width"]
}else{

};
if(node["value"]){
return node["width"]=(wordPad+ctxRef.measureText(node["value"])["width"])
}else{
var i=0;
var width=0;
while((i<node["children"]["length"])){
if(!(node["children"][i]["width"])){
exports.calcWidth(node["children"][i])
}else{

};
width=(width+listPad+node["children"][i]["width"]);
i=(i+1)
};
return node["width"]=width
}
}});