define("./ilBackend",["require","exports","module"],function(require,exports,module){exports["binaryEncode"]=function(tree,acc){
var joinResult=!(acc);
acc=(acc||[]);
acc.push(String.fromCharCode(tree["length"]));
if(Array.isArray(tree)){
acc.push("{");
tree.map(function(elem){
return exports.binaryEncode(elem,acc)
})
}else{
acc.push("\"");
acc.push(tree)
};
return (joinResult&&acc.join(""))
};
var hasValue=function(val){
return !((this.indexOf(val)===-1))
};
exports["toIL"]=function(ast){
var functions=[];
var fnid=0;
var compileFunction=function(name,args,ast){
var nextid=0;
args["hasValue"]=hasValue;
var locals=[];
locals["hasValue"]=hasValue;
var globals=[];
globals["hasValue"]=hasValue;
var currentFunction=[];
var compileExpression=function(expr,withArg){
var code=[];
if(Array.isArray(expr)){
var first=expr[0];
if((first==="#")){
return compileExpression.call(null,"undefined",withArg)
}else{

};
if((first==="set")){
code=code.concat(compileExpression.call(null,expr[2],true));
var name=expr[1];
if(args.hasValue(name)){
code.push(["setArg",expr[1]])
}else{
if(locals.hasValue(name)){
code.push(["setLocal",expr[1]])
}else{
code.push(["setGlobal",expr[1]]);
if(!(globals.hasValue(name))){
globals.push(name)
}else{

}
}
};
if(!(withArg)){
code.push(["pop"])
}else{

};
return code
}else{

};
if((first==="def")){
locals.push(expr[1]);
code=code.concat(compileExpression.call(null,expr[2],true));
code.push(["setLocal",expr[1]]);
if(!(withArg)){
code.push(["pop"])
}else{

};
return code
}else{

};
if((first==="if-else")){
var label1=nextid.toString();
nextid=(nextid+1);
var label2=nextid.toString();
nextid=(nextid+1);
code=code.concat(compileExpression.call(null,expr[1],true));
code.push(["jumpIfFalsy",label1]);
code=code.concat(compileExpression.call(null,expr[2],withArg));
code.push(["jump",label2]);
code.push(["label",label1]);
code=code.concat(compileExpression.call(null,expr[3],withArg));
code.push(["label",label2]);
return code
}else{

};
if((first==="fn")){
var id=("_"+fnid);
fnid=(fnid+1);
var createdFunction=compileFunction.call(null,id,expr[1],["do"].concat(expr.slice(2)));
functions.push(createdFunction);
var i=0;
var fnGlobals=createdFunction[4];
while((i<fnGlobals["length"])){
var globName=fnGlobals[i];
if(!(globals.hasValue(globName))){
globals.push(globName)
}else{

};
i=(i+1)
};
return [["fn",id]]
}else{

};
if((first==="do")){
var i=1;
var length=expr["length"];
while((i<length)){
code=code.concat(compileExpression.call(null,expr[i],((i===(length-1))&&withArg)));
i=(i+1)
};
return code
}else{

};
if(true){
var method=expr[1];
expr=expr.slice(1);
expr[0]=first;
var types=expr.map(function(){
return "var"
});
while((0<expr["length"])){
code=code.concat(compileExpression.call(null,expr.pop(),true))
};
var invokeExpr=["invoke"];
invokeExpr.push(method);
invokeExpr=invokeExpr.concat(types);
code.push(invokeExpr);
if(!(withArg)){
code.push(["pop"])
}else{

};
return code
}else{

}
}else{

};
if(!(withArg)){
return []
}else{

};
;
if((parseFloat.call(null,expr).toString()===expr)){
return [["num",expr]]
}else{

};
var name=expr;
if(args.hasValue(name)){
code.push(["getArg",name])
}else{
if(locals.hasValue(name)){
code.push(["getLocal",name])
}else{
code.push(["getGlobal",name]);
if(!(globals.hasValue(name))){
globals.push(name)
}else{

}
}
};
return code
};
var code=compileExpression.call(null,ast.slice(0),true);
code.push(["return"]);
currentFunction.push(name);
currentFunction.push(args);
currentFunction.push(locals);
currentFunction.push(globals);
currentFunction.push(code);
return currentFunction
};
functions.push(compileFunction.call(null,"entry",[],ast));
return functions
}});