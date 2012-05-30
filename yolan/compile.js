define("./compile",["require","exports","module"],function(require,exports,module){var fs=module.require("fs");
var yolan=module.require("./yolan");
var syntax=module.require("./syntax");
var macros=module.require("./macros");
var jsBackend=module.require("./jsBackend");
var ilBackend=module.require("./ilBackend");
var action=process["argv"][2];
exports["sourceFiles"]=fs.readdirSync("src").filter(function(name){
return (name.slice(-3)===".yl")
});
var mtime=function(fname){
try{
return fs.statSync(fname)["mtime"].getTime()
}catch(e){
return 0
};
return 0
};
exports["run"]=function(){
return exports["sourceFiles"].forEach(function(f){
var src=("src/"+f);
var dest=("build/"+f.slice(0,-3));
if((mtime.call(null,(dest+".js"))<mtime.call(null,src))){
compile.call(null,src,dest)
}else{

};
return undefined
})
};
exports["yl2js"]=function(src){
return jsBackend.toJS(macros.transform(syntax.parse(syntax.tokenize(src))))
};
var compile=function(src,dest){
return fs.readFile(src,"utf8",function(err,data){
yolan.log(src,"->",dest);
if(err){
return err
}else{

};
;
var ast=macros.transform(syntax.parse(syntax.tokenize(data)));
;
var js=jsBackend.toJS(ast);
var sourceCode=(macros.reverse(ast).slice(1).map(syntax["prettyprint"]).join("\n\n")+"\n");
fs.writeFile((dest+".ast"),syntax.prettyprint(ast));
fs.writeFile((dest+".yl"),sourceCode);
fs.writeFile((dest+".js.raw"),sourceCode);
;
var uglify=require.call(null,"uglify-js");
var jsp=uglify["parser"];
var pro=uglify["uglify"];
try{
var ast=jsp.parse(js)
}catch(e){
yolan.log(dest);
yolan.log(e)
};
js=pro.gen_code(ast,{
"beautify":true
});
fs.writeFile((dest+".js"),js,function(err,data){
if(err){
return err
}else{

};
return true
})
})
}});