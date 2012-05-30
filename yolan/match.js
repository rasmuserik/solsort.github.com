define("./match",["require","exports","module"],function(require,exports,module){;
var match=exports;
match["deepEqual"]=function(a,b){
if((a===b)){
return true
}else{

};
if((typeof a==="string")){
return false
}else{

};
if((typeof b==="string")){
return false
}else{

};
if(!((a["length"]===b["length"]))){
return false
}else{

};
var i=0;
while((i<a["length"])){
if(!(match.deepEqual(a[i],b[i]))){
return false
}else{

};
i=(i+1)
};
return true
};
match["template"]=function(pattern,subst){
if(!(subst)){
return undefined
}else{

};
if((typeof pattern==="string")){
if((pattern[0]==="?")){
return subst[pattern.slice(1)]
}else{

};
return pattern
}else{

};
var result=[];
var i=0;
while((i<pattern["length"])){
var val=pattern[i];
if((typeof val["string"]&&(val.slice(0,3)==="..."))){
result=result.concat(subst[val.slice(3)])
}else{
result.push(match.template(val,subst))
};
i=(i+1)
};
return result
};
match["pattern"]=function(pattern,obj,ctx){
ctx=(ctx||{

});
if((typeof pattern==="string")){
return ((pattern===obj)&&ctx)
}else{

};
if((typeof obj==="string")){
return false
}else{

};
if((pattern["length"]===0)){
return ((obj["length"]===0)&&ctx)
}else{

};
var car=pattern[0];
var cdr=pattern.slice(1);
if((car.slice(0,3)==="...")){
var capt=[];
var name=car.slice(3);
var prevCapt=(name&&ctx[name]);
if(name){
ctx[name]=capt
}else{

};
while(true){
if(match.pattern(cdr,obj,ctx)){
if(!(prevCapt)){
return ctx
}else{

};
if(match.deepEqual(capt,prevCapt)){
return ctx
}else{

}
}else{

};
if((obj["length"]===0)){
return false
}else{

};
capt.push(obj[0]);
obj=obj.slice(1)
}
}else{

};
if((obj["length"]===0)){
return false
}else{

};
if((car[0]==="?")){
var capt=obj[0];
var name=car.slice(1);
var prevCapt=(name&&ctx[name]);
if(name){
ctx[name]=capt
}else{

};
if((prevCapt&&!(match.deepEqual(prevCapt,capt)))){
return false
}else{

};
return match.pattern(cdr,obj.slice(1),ctx)
}else{

};
return (match.pattern(car,obj[0],ctx)&&match.pattern(cdr,obj.slice(1),ctx))
};
match["run"]=function(){
yolan.log(match.pattern(["...","foo","...b"],["foo","bar","baz"]));
yolan.log(match.pattern(["...a","bar","...b"],["foo","bar","baz"]));
yolan.log(match.pattern(["...a","baz","...b"],["foo","bar","baz"]));
yolan.log(match.pattern(["...a","bar","...a"],["foo","bar","baz"]));
yolan.log(match.pattern(["...a","bar","...a"],["foo","bar","foo"]));
yolan.log(match.pattern(["...a","quuz","...b"],["foo","bar","baz"]));
yolan.log(match.pattern(["?a","?b"],["foo","bar"]));
yolan.log(match.pattern(["?a","?a"],["foo","bar"]));
yolan.log(match.pattern(["?a","?a"],["foo","foo"]));
yolan.log(match.template("?a",{
"a":"foobar"
}));
yolan.log(match.template(["?a",["?a"]],{
"a":"foobar"
}));
yolan.log(JSON.stringify(match.template(["...a",["def","?b","?c"],["while",["?b","<","?d"],"...e",["inc","?b"]],"...f"],{
"a":[],"b":"i","c":0,"d":10,"e":[["yolan","log","'","hello","i"]],"f":[]
})))
}});