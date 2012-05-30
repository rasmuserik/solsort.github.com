define("./fib-compile-example",["require","exports","module"],function(require,exports,module){var fib=function(n){
var result=1;
if((1<n)){
result=(fib.call(null,(n-1))+fib.call(null,(n-2)))
}else{

};
yolan.log(result);
return result
};
exports["run"]=function(){
yolan.log(fib.call(null,10))
};
});