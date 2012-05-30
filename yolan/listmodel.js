define("./listmodel",["require","exports","module"],function(require,exports,module){var updateFn=function(){

};
var listModel=exports;
var listPrototype={
"update":function(){
updateFn.call(null,this)
},"getLength":function(){
if(this["children"]){
return this["children"]["length"]
}else{
return this["value"]["length"]
}
}
};
listModel["setUpdateFn"]=function(f){
updateFn=f
};
listModel["create"]=function(list){
var result=Object.create(listPrototype);
if(!(Array.isArray(list))){
result["value"]=list;
return result
}else{

};
result["children"]=list.map(function(elem){
var t=listModel.create(elem);
t["parent"]=result;
return t
});
return result
}});