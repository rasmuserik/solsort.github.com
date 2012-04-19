document["body"]["innerHTML"] = [ "<h1>yay", "I", "am", "here", "again!!!</h1>" ].join(" ");

exports["run"] = function() {
    return document["body"]["innerHTML"] = [ "<h1>RUNNING!</h1>" ].join(" ");
};