define("./main",["require","exports","module"],function(require,exports,module){;
var yolan=module.require("./yolan");
if(((typeof require==="undefined")&&(typeof load==="function"))){
load.call(null,"build/yolan.js");
var exports={

}
}else{

};
var engine=yolan["engine"];
var run=function(args){
yolan.nextTick(function(){
var moduleName=(args[0]||(engine+"main"));
return module.require(("./"+moduleName))["run"].apply(null,args.slice(1))
})
};
exports["run"]=run;
if((engine==="node")){
exports.run(process["argv"].slice(2))
}else{

};
if((engine==="rhino")){
exports.run(Array["prototype"]["slice"].call(arguments,0))
}else{

}});