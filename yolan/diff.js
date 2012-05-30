define("./diff",["require","exports","module"],function(require,exports,module){var diff=exports;
diff["edit"]=function(arr0,arr1){
var start=0;
var result=[];
while(((arr0[start]===arr1[start])&&(start<arr0["length"]))){
result.push("skip");
start=(start+1)
};
var i=(arr0["length"]-1);
var j=(arr1["length"]-1);
var end=0;
while(((arr0[i]===arr1[j])&&(start<=i))){
i=(i-1);
j=(j-1);
end=(end+1)
};
while((start<=i)){
result.push("del");
i=(i-1)
};
while((start<=j)){
result.push("ins");
j=(j-1)
};
while((0<end)){
result.push("skip");
end=(end-1)
};
return result
};
diff["run"]=function(){
yolan.log(diff.edit(["a","b","c","d","e","f"],["a","b","h","d","e","f"]))
};
diff["levenshtein"]=function(arr0,arr1){
var prev=[];
var current=[];
var t=undefined;
var ops=[];
var prevOps=[];
var i=0;
while((i<=arr0["length"])){
current.push(i);
if((1<=i)){
ops[i]=["del",ops[(i-1)]]
}else{

};
i=(i+1)
};
var j=1;
while((j<=arr1["length"])){
t=prev;
prev=current;
current=t;
current[0]=j;
t=prevOps;
prevOps=ops;
ops=t;
ops[0]=["ins",prevOps[0]];
var cj=arr1[(j-1)];
i=1;
while((i<=arr0["length"])){
var ci=arr0[(i-1)];
if((ci===cj)){
ops[i]=["skip",prevOps[(i-1)]];
current[i]=prev[(i-1)]
}else{
var subLength=(prev[(i-1)]+1);
var delLength=(prev[i]+1);
var insLength=(current[(i-1)]+1);
var minLength=Math.min(delLength,subLength,insLength);
if((subLength===minLength)){
ops[i]=["sub",prevOps[(i-1)]]
}else{
if((delLength===minLength)){
ops[i]=["del",prevOps[i]]
}else{
ops[i]=["ins",ops[(i-1)]]
}
};
current[i]=minLength
};
i=(i+1)
};
j=(j+1)
};
var result=[];
ops=ops[(ops["length"]-1)];
while(ops){
result.push(ops[0]);
ops=ops[1]
};
return result.reverse()
};
diff["run2"]=function(){
yolan.log("\n\n");
yolan.log(diff.levenshtein([],["1"]),"\n");
yolan.log(diff.levenshtein(["1"],["1"]),"\n");
yolan.log(diff.levenshtein(["1"],["2"]),"\n");
yolan.log(diff.levenshtein(["1"],[]),"\n");
;
;
yolan.log("\n",diff.levenshtein(["a","b","c","c","d","e","d","f","g","h"],["a","b","c","d","e","e","e","h","f","g"]))
};
});