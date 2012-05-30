define("./blobshot",["require","exports","module"],function(require,exports,module){var webcanvas=module.require("./webcanvas");
var v2d=module.require("./v2d");
var yolan=module.require("./yolan");
var started=false;
var enemies=[];
var count=0;
var bulletSize=0;
var running=true;
var score=0;
var gameOver=function(){
running=false;
ctx["fillStyle"]="#fff";
window.setTimeout(function(){
ctx["fillStyle"]="#000";
ctx["shadowColor"]="#fff";
ctx["shadowBlur"]=size;
ctx["font"]=((size*4)+"px Sans Serif");
ctx["textBaseline"]="middle";
ctx["textAlign"]="center";
ctx.fillText("GAME OVER",(w/2),(h/3));
ctx.fillText(("Score: "+score),(w/2),((h*2)/3));
canvas["onmousedown"]=function(e){
exports.run()
}
},1000)
};
var bulletSource=undefined;
;
var bullets=[];
var newBullet=undefined;
var size=100;
var animate=function(list,color){
var result=[];
ctx["fillStyle"]=color;
list.forEach(function(obj){
ctx.beginPath();
obj["pos"]=obj["pos"].add(obj["v"]);
if((obj["pos"]["x"]<(0-size))){
gameOver.call()
}else{

};
if((obj["dead"]||((w+(size*4))<obj["pos"]["x"])||(obj["pos"]["y"]<(0-size))||((h+size)<obj["pos"]["y"]))){

}else{
result.push(obj)
};
ctx.arc(obj["pos"]["x"],obj["pos"]["y"],obj["size"],(Math["PI"]*2),0);
ctx.fill()
});
return result
};
var blobMain=function(){
if(!(running)){
return
}else{

};
var startTime=Date.now();
bulletSize=(bulletSize+(size/40));
ctx["fillStyle"]="rgba(0,0,0,0.3)";
ctx.fillRect(0,0,w,h);
ctx["fillStyle"]="#fff";
ctx["textBaseline"]="top";
ctx["font"]=(size+"px Sans Serif");
ctx.fillText(("Score: "+score),(size*2),0);
count=(count+1);
if((enemies["length"]<(count/100))){
enemies.push({
"size":(size*(Math.random()+.5)),"pos":v2d.create((w+(size*2)),(Math.random()*(h-size))),"v":v2d.create((Math.random()*size*-0.9),0)
})
}else{

};
yolan.log(enemies["length"]);
enemies=animate.call(null,enemies,"#f00");
if(newBullet){
bullets.push({
"size":bulletSize,"pos":bulletSource,"v":newBullet.sub(bulletSource).norm().scale(size)
});
bulletSize=1;
score=Math.max(0,(score-1));
newBullet=undefined
}else{

};
bullets=animate.call(null,bullets,"#080");
bullets.forEach(function(bullet){
enemies.forEach(function(enemy){
if((bullet["pos"].sub(enemy["pos"]).length()<(bullet["size"]+enemy["size"]))){
bullet["dead"]=true;
enemy["dead"]=true;
score=(20+score)
}else{

}
})
});
window.setTimeout(blobMain,Math.max(0,(50-(Date.now()-startTime))))
};
var ctx=undefined;
var canvas=undefined;
var w=undefined;
var h=undefined;
exports["run"]=function(){
running=true;
webcanvas.init({
"update":function(ctx_,w_,h_,canvas_){
ctx=ctx_;
canvas=canvas_;
w=w_;
h=h_;
size=(h/30);
bulletSource=v2d.create(0,h/2);
var wallcount=30;
var i=0;
enemies=[];
bullets=[];
score=0;
count=0;
while((i<=wallcount)){
bullets.push({
"pos":v2d.create((Math.random()*size),((i*h)/wallcount)),"v":v2d.create(0,0),size:(h/wallcount)
});
i=(i+1)
};
canvas["onmousedown"]=function(e){
newBullet=v2d.create(e["clientX"],e["clientY"]);
E=e;
yolan.log(e)
};
if(!(started)){
blobMain.call()
}else{

}
}
})
}});