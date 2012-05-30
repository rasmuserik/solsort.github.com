define("./testrunner",["require","exports","module"],function(require,exports,module){exports["testFoo"]=function(){
return true
};
exports["run"]=function(){
var scriptList=module.require("fs").readdirSync("src").filter(function(name){
return (name.slice(-3)===".yl")
}).map(function(name){
return ("./"+name.slice(0,-3))
});
scriptList.forEach(function(scriptName){
var obj=module.require(scriptName);
Object.keys(obj).forEach(function(methodName){
var method=obj[methodName];
if(!((methodName.slice(0,4)==="test"))){
return
}else{

};
if((typeof method==="function")){
yolan.log(scriptName,methodName);
method.call(obj)
}else{

}
})
})
}});