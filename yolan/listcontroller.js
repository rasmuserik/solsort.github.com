define("./listcontroller",["require","exports","module"],function(require,exports,module){var yolan=module.require("./yolan");
var syntax=module.require("./syntax");
var webcolor=module.require("./webcolor");
var test=module.require("./test");
var cursor=module.require("./listcursor");
var view=module.require("./listcanvasview");
var model=module.require("./listmodel");
var keyController={

};
var handleKeyEvent=function(ev){
if((ev["keyCode"]===76)){
cursor.moveNext();
return 
}else{

};
if((ev["keyCode"]===72)){
cursor.movePrev();
return 
}else{

};
if((ev["keyCode"]===75)){
cursor.moveUp();
return 
}else{

};
if((ev["keyCode"]===74)){
cursor.moveDown();
return 
}else{

}
};
exports["run"]=function(filename){
keyController["start"]=function(){
document["body"]["onkeydown"]=handleKeyEvent
};
if(!(filename)){
document["body"]["innerHTML"]="Usage: weblist filename";
return undefined
}else{

};
yolan.readTextFile(filename,function(err,data){
yolan.log(data);
if(err){
yolan.log("Error:",err);
return undefined
}else{

};
document["body"]["style"]["margin"]="0px";
document["body"]["style"]["background"]="#f8f8f8";
model.setUpdateFn(view["update"]);
var list=syntax.parse(syntax.tokenize(data));
var obj=model.create(list);
view.init(obj);
obj.update();
cursor.moveTo(obj["children"][0],0);
keyController.start();
document["body"].appendChild(obj["elem"])
})
}});