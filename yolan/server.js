define("./server",["require","exports","module"],function(require,exports,module){var http=module.require("http");
var fs=module.require("fs");
var yolan=module.require("./yolan");
var xml=module.require("./xml");
var app=module.require("express").createServer();
;
var scriptList=["yolan"].concat(fs.readdirSync("src").filter(function(name){
return (name.slice(-3)===".yl")
}).map(function(name){
return name.slice(0,-3)
}));
var head=("<!DOCTYPE html><html>"+xml.fromYl(module.require("./htmlheader")));
var body=("<body>"+"<!--[if lte IE 8]><script>location.href='http://www.google.com/chromeframe?redirect=true'</script><![endif]-->"+"<script>function define(_,_,f){f()};</script>"+scriptList.map(function(name){
return ("<script src=\""+name+".js\"></script>")
}).join("")+"<script>require(\"./main\").run(location.hash.slice(1).split(\" \"));</script>"+"</body></html>");
exports["run"]=function(){
http.createServer(function(request,result){
var url=request["url"];
yolan.log(request["url"]);
if((url.slice(-3)===".js")){
result.writeHead(200,{
"Content-Type":"text/javascript"
});
var name=("."+url.slice(0,-3));
fs.readFile(("./src/"+name+".yl"),"utf8",function(err,data){
if(err){
result.end(err.toString());
return false
}else{

};
return result.end(("define(\""+name+"\",[\"require\",\"exports\",\"module\"],function(require,exports,module){"+module.require("./compile").yl2js(data)+"});"))
});
return true
}else{

};
yolan.log(url.slice(0,5));
if((url.slice(0,14)==="/readTextFile/")){
yolan.readTextFile(url.slice(14),function(err,data){
if(err){
result.writeHead(404,{
"Content-Type":"text/plain"
});
result.end(JSON.stringify(err));
return false
}else{

};
result.writeHead(200,{
"Content-Type":"text/plain"
});
return result.end(data)
});
return true
}else{

};
if((url.slice(0,15)==="/writeTextFile/")){
var buf="";
request.on("data",function(data){
return buf=(buf+data.toString())
});
request.on("end",function(data){
return fs.writeFile(url.slice(15),buf,function(err,data){
if(err){
result.writeHead(500,{
"Content-Type":"text/plain"
});
result.end(err.toString());
return false
}else{

};
result.writeHead(200,{
"Content-Type":"text/plain"
});
return result.end("OK")
})
});
return true
}else{

};
if((url.slice(0,5)==="/get/")){
result.writeHead(200,{
"Content-Type":"text/plain"
});
fs.readFile(("./src/"+url.slice(5)+".yl"),"utf8",function(err,data){
if(err){
result.end(err.toString());
return false
}else{

};
return result.end(data)
});
return true
}else{

};
if((url.slice(0,5)==="/put/")){
var buf="";
result.writeHead(200,{
"Content-Type":"text/plain"
});
request.on("data",function(data){
return buf=(buf+data.toString())
});
request.on("end",function(data){
return fs.writeFile(("./src/"+url.slice(5)+".yl"),buf,function(err,data){
if(err){
result.end(err.toString());
return false
}else{

};
return result.end("")
})
});
return true
}else{

};
result.writeHead(200,{
"Content-Type":"text/html"
});
result.end((head+body));
return true
}).listen(1234);
return yolan.log(["starting","server","on","localhost","port","1234"])
}});