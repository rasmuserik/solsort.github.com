define("./listcursor",["require","exports","module"],function(require,exports,module){var cursorRef=undefined;
var cursor=exports;
exports["moveTo"]=function(obj,pos){
if(cursorRef){
cursorRef["cursor"]=undefined;
cursorRef.update()
}else{

};
cursorRef=obj;
cursorRef["cursor"]=pos;
cursorRef.update()
};
exports["moveUp"]=function(){
cursorRef["cursor"]=(cursorRef["cursor"]-1);
if(((cursorRef["cursor"]<0)&&cursorRef["parent"])){
cursor.moveTo(cursorRef["parent"],cursorRef["parent"]["children"].indexOf(cursorRef));
return 
}else{

};
if((cursorRef["cursor"]<0)){
cursorRef["cursor"]=0
}else{

};
cursorRef.update()
};
exports["moveDown"]=function(){
cursorRef["cursor"]=(cursorRef["cursor"]+1);
if(((cursorRef.getLength()<cursorRef["cursor"])&&cursorRef["parent"])){
cursor.moveTo(cursorRef["parent"],(cursorRef["parent"]["children"].indexOf(cursorRef)+1));
return 
}else{

};
cursorRef.update()
};
exports["movePrev"]=function(){
if((cursorRef["children"]&&(0<cursorRef["cursor"]))){
var child=cursorRef["children"][(cursorRef["cursor"]-1)];
cursor.moveTo(child,child.getLength());
return 
}else{

};
cursorRef["cursor"]=(cursorRef["cursor"]-1);
if(((cursorRef["cursor"]<0)&&cursorRef["parent"])){
cursor.moveTo(cursorRef["parent"],cursorRef["parent"]["children"].indexOf(cursorRef));
return 
}else{

};
if((cursorRef["cursor"]<0)){
cursorRef["cursor"]=0
}else{

};
cursorRef.update()
};
exports["moveNext"]=function(){
if((cursorRef["children"]&&(cursorRef["cursor"]<cursorRef["children"]["length"]))){
cursor.moveTo(cursorRef["children"][cursorRef["cursor"]],0);
return 
}else{

};
cursorRef["cursor"]=(cursorRef["cursor"]+1);
if(((cursorRef.getLength()<cursorRef["cursor"])&&cursorRef["parent"])){
cursor.moveTo(cursorRef["parent"],(cursorRef["parent"]["children"].indexOf(cursorRef)+1));
return 
}else{

};
cursorRef.update()
}});