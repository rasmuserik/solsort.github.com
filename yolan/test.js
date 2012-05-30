define("./test",["require","exports","module"],function(require,exports,module){var test=exports;
var proto={
"fail":function(message){
yolan.log("Test failure:",this["name"],message)
},"assert":function(a,message){
if(!(a)){
yolan.log("assert",a,"fails in:",message)
}else{

}
},"assertEqual":function(a,b){
yolan.log("AssertEqual",a,b,"(",this["name"],")");
try{
if(!((JSON.stringify(a)===JSON.stringify(b)))){
yolan.log("Error not equal",a,b,"in",this["name"])
}else{

}
}catch(e){
yolan.log("Error could not compare",a,b,"in",test["name"],"error:",e)
}
},"done":function(){
yolan.log("Test done",this["name"])
}
};
test["case"]=function(name){
yolan.log("Starting testcase:",name);
var result=Object.create(proto);
result["name"]=name;
return result
};
var yolan=module.require("./yolan");
test["run"]=function(args){
var testcase=test.case("yolanIO");
yolan.writeTextFile("test-tmp/yolanIOtest","testvalue",function(err){
if(err){
testcase.fail("writeError")
}else{

};
yolan.readTextFile("test-tmp/yolanIOtest",function(err,data){
if(err){
testcase.fail("readError")
}else{

};
testcase.assertEqual(data,"testvalue");
testcase.done()
})
});
var testcase=test.case("yolanUtility");
testcase.assert(yolan.arrayHasMember(["1","2","3","4"],3),"arrayHasMember1");
testcase.assert(!(yolan.arrayHasMember(["1","2","3","4"],7)),"arrayHasMember2");
testcase.done()
}});