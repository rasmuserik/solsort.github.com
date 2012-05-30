define("./webcolor",["require","exports","module"],function(require,exports,module){exports["intToColor"]=function(i){
return ("#"+(0x1000000+(i&0xffffff)).toString(16).slice(1))
};
exports["djb2hash"]=function(str){
var hash=5381;
var i=0;
var len=str["length"];
while((i<len)){
hash=(0|((hash*31)+str.charCodeAt(i)));
i=(i+1)
};
return hash
};
var seed=Date.now();
exports["random"]=function(localSeed){
seed=(localSeed||seed);
seed=(0|((seed*1664525)+1013904223));
return seed
};
exports["hashColor"]=function(str){
return exports.intToColor(exports.random(exports.djb2hash(str)))
};
exports["hashLightColor"]=function(str){
return exports.intToColor((0xe0e0e0|(exports.random(exports.djb2hash(str))/32)))
}});