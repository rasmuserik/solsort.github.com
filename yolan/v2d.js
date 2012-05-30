define("./v2d",["require","exports","module"],function(require,exports,module){var v2d=exports;
v2d["create"]=function(x,y){
var result=Object.create(v2d);
result["x"]=x;
result["y"]=y;
return result
};
v2d["add"]=function(v){
return v2d.create((this["x"]+v["x"]),(this["y"]+v["y"]))
};
v2d["sub"]=function(v){
return v2d.create((this["x"]-v["x"]),(this["y"]-v["y"]))
};
v2d["scale"]=function(a){
return v2d.create((this["x"]*a),(this["y"]*a))
};
v2d["length"]=function(){
var x=this["x"];
var y=this["y"];
return Math.sqrt(((x*x)+(y*y)))
};
v2d["norm"]=function(){
var a=this.length();
a=(a&&(1/a));
return v2d.create((this["x"]*a),(this["y"]*a))
}});