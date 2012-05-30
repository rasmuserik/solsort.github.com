define("./webedit",["require","exports","module"],function(require,exports,module){var yolan=module.require("./yolan");
exports["run"]=function(fname){
var body=document["body"];
yolan.log(fname);
body["innerHTML"]=module.require("./xml").fromYl(["div",[["style","position:","absolute;","top:","0px;","left:","0px;","margin:","0;","padding:","0;","width:","100%;","height:","100%;","overflow:","hidden"]],["textarea",[["id","editarea"],["style","width:100%;","height:","90%"]]," "],["button",[["id","savebutton"],["style","position:","absolute;","top:","90%;","left","0;","width:100%;","height:","10%"]],"save"]]);
yolan.readTextFile(fname,function(err,data){
if(err){
data=err.toString()
}else{

};
document.getElementById("editarea")["value"]=data;
return yolan.log("readfile",fname,data,err)
});
return document.getElementById("savebutton")["onclick"]=function(ev){
yolan.writeTextFile(fname,document.getElementById("editarea")["value"]);
return undefined
}
}});