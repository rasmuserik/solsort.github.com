fs = require('fs');
uglify = require('uglify-js');

fs.readFile('../scripts/combigame.js','utf8',function(err, data) {
        console.log(data);
    if(err) throw err;
    console.log(JSON.stringify(uglify.parser.parse(data)));
});
