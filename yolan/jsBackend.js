define("./jsBackend",["require","exports","module"],function(require,exports,module){var compileJS={
"builtin:":function(syn){
return exports.toJS(syn.slice(1))
},"do":function(syn){
return syn.slice(1).map(exports["toJS"]).join(";\n")
},"def":function(syn,syn1){
return ("var "+syn1+"="+exports.toJS(syn[2]))
},"set":function(syn,syn1){
return (syn1+"="+exports.toJS(syn[2]))
},"new-object":function(syn){
var result=[];
var i=1;
while((i<syn["length"])){
result.push((exports.toJS(syn[i])+":"+exports.toJS(syn[(i+1)])));
i=(i+2)
};
return ("{\n"+result.join(",")+"\n}")
},"new":function(syn,syn1){
if((syn1==="object")){
return ("{\n"+syn.slice(2).map(function(pair){
return (exports.toJS(pair[0])+":"+exports.toJS(pair[1]))
}).join(",")+"\n}")
}else{

};
if((syn1==="array")){
return ("["+syn.slice(2).map(exports["toJS"]).join(",")+"]")
}else{

};
return ("new "+syn1+"()")
},"fn":function(syn,syn1){
return ("function("+syn1.join(",")+"){\n"+syn.slice(2).map(exports["toJS"]).join(";\n")+"\n}")
},"try-catch":function(syn,syn1){
return ("try{\n"+exports.toJS(syn[2])+"\n}catch("+syn[1]+"){\n"+exports.toJS(syn[3])+"\n}")
},"while":function(syn,syn1){
return ("while("+exports.toJS(syn1)+"){\n"+syn.slice(2).map(exports["toJS"]).join(";\n")+"\n}")
},"if-else":function(syn,syn1){
return ("if("+exports.toJS(syn1)+"){\n"+exports.toJS(syn[2])+"\n}else{\n"+exports.toJS(syn[3])+"\n}")
},"Annotation:":function(syn){
return exports.toJS(syn[2])
},"return":function(syn,syn1){
return ("return "+exports.toJS(syn1))
},"quote":function(syn,syn1){
return JSON.stringify(syn1)
}
};
exports["toJS"]=function(syn){
if(!(syn)){
return ""
}else{

};
var syn0=syn[0];
var syn1=syn[1];
var syn2=syn[2];
if((typeof syn==="string")){
return syn
}else{

};
if(compileJS[syn0]){
return compileJS[syn0].call(null,syn,syn1)
}else{

};
if((syn1==="<<")){
return ("("+exports.toJS(syn0)+"<<"+exports.toJS(syn2)+")")
}else{

};
if((syn1===">>")){
return ("("+exports.toJS(syn0)+">>"+exports.toJS(syn2)+")")
}else{

};
if((syn1==="set")){
return (exports.toJS(syn0)+"["+exports.toJS(syn2)+"]="+exports.toJS(syn[3]))
}else{

};
if((syn1==="/")){
return ("("+[exports.toJS(syn0)].concat(syn.slice(2).map(exports["toJS"])).join("/")+")")
}else{

};
if((syn1==="*")){
return ("("+[exports.toJS(syn0)].concat(syn.slice(2).map(exports["toJS"])).join("*")+")")
}else{

};
if((syn1==="|")){
return ("("+[exports.toJS(syn0)].concat(syn.slice(2).map(exports["toJS"])).join("|")+")")
}else{

};
if((syn1==="&")){
return ("("+[exports.toJS(syn0)].concat(syn.slice(2).map(exports["toJS"])).join("&")+")")
}else{

};
if((syn1==="+")){
return ("("+[exports.toJS(syn0)].concat(syn.slice(2).map(exports["toJS"])).join("+")+")")
}else{

};
if((syn1==="-")){
return ("("+[exports.toJS(syn0)].concat(syn.slice(2).map(exports["toJS"])).join("-")+")")
}else{

};
if((syn1==="and")){
return ("("+[exports.toJS(syn0)].concat(syn.slice(2).map(exports["toJS"])).join("&&")+")")
}else{

};
if((syn1==="or")){
return ("("+[exports.toJS(syn0)].concat(syn.slice(2).map(exports["toJS"])).join("||")+")")
}else{

};
if((syn1==="==")){
return ("("+exports.toJS(syn0)+"==="+exports.toJS(syn2)+")")
}else{

};
if((syn1==="<")){
return ("("+exports.toJS(syn0)+"<"+exports.toJS(syn2)+")")
}else{

};
if((syn1==="<=")){
return ("("+exports.toJS(syn0)+"<="+exports.toJS(syn2)+")")
}else{

};
if((syn1==="fails")){
return ("!("+exports.toJS(syn0)+")")
}else{

};
if((syn1==="jsType")){
return ("typeof "+exports.toJS(syn0))
}else{

};
if((syn1==="get")){
return (exports.toJS(syn0)+"["+exports.toJS(syn2)+"]")
}else{

};
if((typeof syn0==="string")){
return (exports.toJS(syn0)+"."+syn1+"("+syn.slice(2).map(exports["toJS"]).join(",")+")")
}else{

};
return (exports.toJS(syn0)+"."+syn1+"("+syn.slice(2).map(exports["toJS"]).join(",")+")")
}});