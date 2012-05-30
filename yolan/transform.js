define("./transform",["require","exports","module"],function(require,exports,module){exports["transform"]=function(x){
if((typeof x==="string")){
return x
}else{

};
x=x.map(exports["transform"]);
if((x[0]==="if")){
x[0]="if-else"
}else{

};
return x
}});