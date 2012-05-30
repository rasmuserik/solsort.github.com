define("./webcanvas",["require","exports","module"],function(require,exports,module){var xml=module.require("./xml");
var yolan=module.require("./yolan");
exports["init"]=function(obj){
var update=(obj["update"]||function(ctx,w,h,canvas){
return undefined
});
var keydown=(obj["keydown"]||function(k){
return undefined
});
var width=window["innerWidth"];
var height=window["innerHeight"];
var body=document["body"];
body["innerHTML"]=xml.fromYl(["canvas",[["id","canvas"]],"This","webapp","requires","a","browser","that","has","canvas","support.","You","need","to","upgrade","your","browser","to","see","this","site."]);
var canvas=document.getElementById("canvas");
var style=canvas["style"];
yolan.log(canvas,style);
style["position"]="fixed";
style["top"]="0px";
style["left"]="0px";
style["height"]=(height+"px");
style["width"]=(width+"px");
canvas["height"]=height;
canvas["width"]=width;
body["onkeydown"]=function(ev){
return yolan.log(ev)
};
canvas.focus();
var ctx=canvas.getContext("2d");
return update.call(null,ctx,width,height,canvas)
};
exports["run"]=function(){
return exports.init({
"update":function(ctx,w,h){
ctx["fillStyle"]="#990";
ctx.fillText("Hello canvas",100,100);
return ctx.fillRect(-5,-5,10000,1000)
}
})
}});