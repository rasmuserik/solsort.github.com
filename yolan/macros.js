define("./macros",["require","exports","module"],function(require,exports,module){var yolan=module.require("./yolan");
var macros=exports;
var match=module.require("./match");
var onEach=[];
var forwardTransforms=[];
var reverseTransforms=[];
macros["transform"]=function(node){
if((typeof node==="string")){
return node
}else{

};
var i=forwardTransforms["length"];
var done=false;
var finish=function(){
return done=true
};
while((0<i)){
i=(i-1);
node=forwardTransforms[i].call(null,node,finish);
if(done){
return node
}else{

}
};
node=node.map(macros["transform"]);
return node
};
macros["transformList"]=function(list){
return list.map(macros["transform"])
};
macros["reverse"]=function(node){
if((typeof node==="string")){
return node
}else{

};
var i=0;
var done=false;
var finish=function(){
return done=true
};
while((i<reverseTransforms["length"])){
node=reverseTransforms[i].call(null,node,finish);
if(done){
return node
}else{

};
i=(i+1)
};
node=node.map(macros["reverse"]);
return node
};
macros["reverseList"]=function(list){
return list.map(macros["reverse"])
};
var builtins=["return","fn","do","def","set","new-object","try-catch","while","if-else","Annotation:","return","quote"];
forwardTransforms.push(function(node){
if(((node["length"]<2)||!((node[1][0]==="quote"))||yolan.arrayHasMember(builtins,node[0]))){
return node
}else{

};
while(((2<node["length"])&&(node[1]["length"]===2)&&(node[1][0]==="quote"))){
node=[[node[0],"get",node[1]]].concat(node.slice(2))
};
if(((1<node["length"])&&(node[1][0]==="quote"))){
node=[node[0],"get",node[1]]
}else{

};
return node
});
reverseTransforms.push(function(node){
if(yolan.arrayHasMember(builtins,node[0])){
return node
}else{

};
if(((node["length"]===3)&&(node[1]==="get")&&(node[2][0]==="quote"))){
node=node.slice(0);
node[1]=node[2];
node.pop()
}else{

};
return node
});
var quoteTransform=function(node,finish){
if(((node[0]==="'")&&(node["length"]===2))){
finish.call();
return ["quote"].concat(node[1])
}else{

};
var result=[];
var i=0;
while((i<node["length"])){
if(((node[i]==="'")&&((i+1)<node["length"]))){
i=(i+1);
result.push(["quote",node[i]])
}else{
result.push(node[i])
};
i=(i+1)
};
return result
};
forwardTransforms.push(quoteTransform);
reverseTransforms.push(function(node,finish){
if(((node["length"]===2)&&(node[0]==="quote"))){
finish.call();
return ["'",node[1]]
}else{

};
return node
});
forwardTransforms.push(function(node,finish){
if((node[0]==="quote")){
finish.call()
}else{

};
return node
});
forwardTransforms.push(function(node){
if((node[0]==="if")){
return ["if-else",macros.transform(node[1]),["do"].concat(macros.transformList(node.slice(2)))]
}else{

};
return node
});
reverseTransforms.push(function(node){
if(((node[0]==="if-else")&&(node["length"]===3))){
if((node[2][0]==="do")){
return ["if",node[1]].concat(node[2].slice(1))
}else{
return ["if",node[1],node[2]]
}
}else{

};
return node
});
forwardTransforms.push(function(node,finish){
if((node[0]===";")){
finish.call();
return ["Annotation:",node]
}else{

};
return node
});
reverseTransforms.push(function(node,finish){
if(((node[0]==="Annotation:")&&(node["length"]===2)&&(node[1][0]===";"))){
finish.call();
return node[1]
}else{

};
return node
});
forwardTransforms.push(function(node,finish){
if((node[0]==="Section:")){
finish.call();
var doc=[];
var code=["do"];
var i=0;
while((typeof node[i]==="string")){
doc.push(node[i]);
i=(i+1)
};
while((i<node["length"])){
code.push(node[i]);
i=(i+1)
};
code=macros.transform(code);
return ["Annotation:",doc,code]
}else{

};
return node
});
reverseTransforms.push(function(node){
if(((node[0]==="Annotation:")&&(node["length"]===3)&&(node[1][0]==="Section:")&&(node[2][0]==="do"))){
return node[1].concat(node[2].slice(1))
}else{

};
return node
});
forwardTransforms.push(function(node){
if((node[0]==="@")){
return ["new","array"].concat(node.slice(1))
}else{

};
return node
});
reverseTransforms.push(function(node){
if(((node[0]==="new")&&(node[1]==="array"))){
return ["@"].concat(node.slice(2))
}else{

};
return node
});
forwardTransforms.push(function(node){
if((node[0]==="#")){
var result=["new-object"];
node.slice(1).forEach(function(elem){
elem=quoteTransform.call(null,elem,function(){

});
result.push(elem[0]);
result.push(elem[1])
});
return result
}else{

};
return node
});
reverseTransforms.push(function(node){
if(((node[0]==="new")&&(node[1]==="object"))){
return ["#"].concat(node.slice(2))
}else{

};
return node
});
reverseTransforms.push(function(node,finish){
if((node[0]==="new-object")){
var result=["#"];
var i=1;
while((i<node["length"])){
result.push([node[i],node[(i+1)]]);
i=(i+2)
};
return result
}else{

};
return node
});
;
macros["createTransform"]=function(from,to){
return function(node){
var capt=match.pattern(from,node);
return (match.template(to,capt)||node)
}
};
macros["codeTransform"]=function(from,to){
forwardTransforms.push(macros.createTransform(from,to));
reverseTransforms.push(macros.createTransform(to,from))
};
macros.codeTransform(["inc","?var"],["set","?var",["?var","+","1"]]);
macros.codeTransform(["dec","?var"],["set","?var",["?var","-","1"]]);
macros.codeTransform(["countup","?var","?start","?end","...code"],["do",["def","?var","?start"],["while",["?var","<","?end"],"...code",["set","?var",["1","+","?var"]]]])});