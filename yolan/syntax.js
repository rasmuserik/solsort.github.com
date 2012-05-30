define("./syntax",["require","exports","module"],function(require,exports,module){exports["tokenize"]=function(str){
var result=[];
var i=0;
var tokeniser={

};
var c=str[0];
var nextc=function(){
i=(i+1);
c=str[i];
return c
};
var isWs=function(){
return ((c===" ")||(c==="\n")||(c==="\r")||(c==="\t"))
};
var isPrefix=function(){
return ((c==="'")||(c==="'")||(c==="'")||(c==="'"))
};
var isBracket=function(){
return ((c==="[")||(c==="]"))
};
while(c){
while(isWs.call()){
nextc.call()
};
if((c==="[")){
result.push(lbracket);
nextc.call()
}else{
if((c==="]")){
result.push(rbracket);
nextc.call()
}else{
if(isPrefix.call()){
result.push(c);
nextc.call()
}else{
var symb="";
while((c&&!(isWs.call())&&!(isBracket.call()))){
if((c==="\\")){
nextc.call();
if(!((isWs.call()||isBracket.call()||isPrefix.call()))){
symb=(symb+"\\")
}else{

}
}else{

};
if((c==="\"")){
symb=(symb+"\\")
}else{

};
symb=(symb+c);
nextc.call()
};
result.push(symb)
}
}
}
};
if((result[(result["length"]-1)]["length"]===0)){
result.pop()
}else{

};
return result
};
var quote={
"quote":true
};
var lbracket={
"lbracket":true
};
var rbracket={
"rbracket":true
};
var addQuotes=function(list){
var i=0;
var result=[];
while((i<list["length"])){
var elem=list[i];
if((elem===quote)){
i=(i+1);
elem=["quote",list[i]]
}else{

};
result.push(elem);
i=(i+1)
};
return result
};
exports["parse"]=function(tokens){
tokens=tokens.reverse();
var stack=[];
var current=["do"];
while(tokens["length"]){
var token=tokens.pop();
if((token===lbracket)){
stack.push(current);
current=[]
}else{
if((token===rbracket)){
var t=current;
current=stack.pop();
current.push(t)
}else{
current.push(JSON.parse(("\""+token+"\"")))
}
}
};
return current
};
var screenWidth=78;
var indentStep=2;
exports["nspace"]=function(n){
var result=[];
while((0<n)){
n=(n-1);
result.push(" ")
};
return result.join("")
};
var indent=0;
var escapeRegEx=RegExp.call(RegExp,"[' \\[\\]]","g");
var escapeRegEx2=RegExp.call(RegExp,"\\\\\"","g");
exports["prettyprint"]=function(ast){
if((typeof ast==="string")){
if((ast==="'")){
return "'"
}else{

};
return JSON.stringify(ast).slice(1,-1).replace(escapeRegEx,function(s){
return ("\\"+s)
}).replace(escapeRegEx2,"\"")
}else{

};
if((0===ast["length"])){
return "[]"
}else{

};
if(((2===ast["length"])&&(ast[0]==="'"))){
return ("'"+exports.prettyprint(ast[1]))
}else{

};
indent=(indent+indentStep);
var lineStart="[";
var lineEnd="]";
var pos=(indent+lineStart["length"]);
var strs=ast.map(exports["prettyprint"]);
if(((pos+strs.join()["length"]+1)<screenWidth)){
indent=(indent-indentStep);
return (lineStart+strs.join(" ")+lineEnd)
}else{

};
var space=("\n"+exports.nspace(indent));
var result=[];
result.push(lineStart);
result.push(strs[0]);
pos=(pos+strs[0]["length"]+1);
var forceNewLine=false;
var currentIsString=true;
var i=1;
while((i<strs["length"])){
var prevIsString=currentIsString;
currentIsString=(typeof ast[i]==="string");
forceNewLine=false;
if((!(prevIsString)||!(currentIsString))){
forceNewLine=true
}else{

};
if((i<2)){
forceNewLine=false
}else{

};
var prevIsString=currentIsString;
result.push(" ");
if((forceNewLine||(screenWidth<(pos+strs[i]["length"])))){
result.pop();
result.push(space);
pos=indent
}else{

};
result.push(strs[i]);
pos=(pos+strs[i]["length"]+1);
i=(i+1)
};
result.push(lineEnd);
indent=(indent-indentStep);
return result.join("")
}});