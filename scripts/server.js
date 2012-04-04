#!/usr/bin/env node
// Development server and bundling tool for creating JavaScript web applications.
//
// ## Features:
//
// - CommonJS modules
// - watch files / recompile bundles on change 
// - local server on port 8080
// - automatic, enforced checks with jshint
// - loading with line-numbers preserved on browsers supporting `//@sourceURL=`
// - realtime generation of `docco`-documentation
// - different bundles, ie. one bundle for modern browsers with zepto.js and
//   another for legacy browsers with jquery, es5shim, json, etc.
// - bundles debug version + deploy version
//
// ## Why make a new bundling tool
//
// None fitted exactly what I needed, and it was trivial to implement
//
// - enderjs - misses watchin/development mode.
// - requirejs - requires manual wrapping of modules, and the dynamic loading
//   had issues on windows phones.
// - browserify - adding extra code, not minifying (may probably be done via
//   plugins, but that would probably be more work than to hack this code
//   together. Watching also didn't work well (vim writes file by moving the
//   new version into the old version, witch made watching barf).
// - assetgraph - looks promising, but solves another problem: full web sites,
//   where the need here is to have a developer friendly pure-javascript app
//   development.
//
// ## TODO
//
// - npm-compatibility / better path handling + find depended modules
//   automatically
// - better error-reporting when uglify fails
// - code coverage
// - strip test code from modules (`exports.test*`) during minification
// - output widgets/apps too
//
// # The actual code

// Enforce strict checking when running checks.
/*global require:true,console:true,process:true,__dirname:true*/
/*jshint es5:true,strict:true,trailing:true,curly:true,eqeqeq:true*/
(function() {'use strict';

// ## Dependencies
var util = require('./util');
var async = require('async');
var fs = require('fs');
var uglify = require('uglify-js');
var mustache = require('mustache');
var _ = require('underscore');
var jshint = require('jshint').JSHINT;
var spawn = require('child_process').spawn;

// # Functions to build application bundle
// 
// A lot of these are passing an `obj`-object around, which accumulates
// the different information on the JavaScript file, ie. filename, source,
// minified version, errors ...

// Read a file
function readFile(obj, callback) {
    console.log('readfile', obj.filename);
    fs.readFile(obj.filename, 'utf8', function(err, data) {
        obj.err = err;
        obj.filedata = data;
        callback(obj);
    });
}

// Run strict jshint on the file
function jsHint(obj, callback) {
    console.log('jshint', obj.filename);
    if(obj.err) {
        return callback(obj);
    }
    jshint('/*jshint strict: true, trailing: true, curly: true, ' +
           'es5: true, eqeqeq: true*/(function(){"use strict";' +
           '/*global require:true,module:true,exports:true,' +
            'console:true,setTimeout:true */' +
           obj.filedata + '})();');
    obj.jshint = '';
    // Reporting
    jshint.errors.forEach(function(err) { if(err) {
        obj.jshint += mustache.to_html(
            '<div>{{file}} line {{line}} pos {{pos}}: {{err}}</div>',
            {file: obj.filename, line: err.line, 
            pos: err.character, err: err.reason});
    } });
    return callback(obj);
}

// ## Minification and metaprocessing
//
// Currenly just minify.
//
// TODO: add code coverage, and removal of test code
function applyUglify(obj, callback) {
    console.log('uglify', obj.filename);
    if(obj.err) {
        return callback(obj);
    }
    try {
        var ast = uglify.parser.parse(obj.filedata);
        var mangled = uglify.uglify.ast_mangle(ast);
        var squeezed = uglify.uglify.ast_squeeze(ast);
        obj.minified = uglify.uglify.gen_code(squeezed);
    } catch(e) {
        // TODO: nicer error-reporting
        obj.err = {err: 'uglify-error', details: e};
    }
    callback(obj);
}

// Code used to define the module in the bundle.
function moduleString(modulename, modulesource) {
    return ['bundler.module(\'', modulename, '\',\'', 
            util.stringEscape(modulesource) , '\');'].join('');
}

// Do, what has to be done, to a single file. This is where the core logic of
// processing each file is defined.
function processFile(obj, callback) {
    spawn('docco', [obj.filename]);
    readFile(obj, function(obj) {
    jsHint(obj, function(obj) {
    applyUglify(obj, function(obj) {
    callback(null, obj);
    });});});
}

// ### Utilities for watching a files for changes
function watchCallback(obj, writeModulesCallback) { 
        return function(done) {
    fs.unwatchFile(obj.filename);
    fs.watchFile(obj.filename, obj.watchCallback);
    processFile(obj, function() {
        writeModulesCallback(done);
    });
};}

function watchObj(obj, writeModulesCallback) {
    // needs timeout to handle vims delete+create file when saving
    obj.watchCallback = util.delaySingleExecAsync(
            watchCallback(obj, writeModulesCallback), 1000);
    fs.watchFile(obj.filename, obj.watchCallback);
}

function writeBundle(bundle, fileObjHash, callback) {
    console.log('writebundle', bundle.out);
    var resultFile = [];
    var err = '';
    bundle.libs.forEach(function(libName) {
        var lib = fileObjHash[libName];
        if(lib.err) {
            console.log(libName, lib.err);
            err += lib.err;
        } else {
            resultFile.push(lib.filedata);
        }
    });
    bundle.modules.forEach(function(moduleName) {
        var module = fileObjHash[moduleName];
        if(module.err) {
            err += moduleName + JSON.stringify(module.err);
            console.log(moduleName, module.err);
        } else {
            resultFile.push(moduleString(
                moduleName, module[bundle.moduleVersion]));
            err += module.jshint;
        }
    });
    resultFile.push(bundle.run);
    resultFile = resultFile.join('\n');
    if(err) {
        resultFile = "document.body.innerHTML='" +
            util.stringEscape(err)+ "';";
    } 
    fs.writeFile(bundle.out, resultFile, 'utf8', callback);
}

function writeBundles(bundles, fileObjs, callback) {
    var fileObjHash = {};
    fileObjs.forEach(function(obj) {
        fileObjHash[obj.filename] = obj;
    });
    async.forEach(bundles, function(bundle, callback) {
        writeBundle(bundle, fileObjHash, callback);
    }, callback);

    writeCacheManifest();
}

function writeCacheManifest() {
    var i,j,k,l;
    var manifest = ['CACHE MANIFEST', '# ' + (new Date()), '\nNETWORK:\n*', '\nCACHE:', '/dist/bundle.min.js'];
    for(i=0;i<3;++i){for(j=0;j<3;++j){for(k=0;k<3;++k){for(l=0;l<3;++l){
        manifest.push('/dist/combigame'+i+j+k+l+'.png');
    }}}}
    async.forEach(['images', 'notes'], function(dir, done) {
        fs.readdir(dir, function(err, data) {
            if(err) {
                throw err;
            }
            data.forEach(function(filename) {
                manifest.push('/' + dir + '/' + filename);
            });
            done()
        });
    }, function() {
        console.log('writing manifest.appcache');
        fs.writeFile('manifest.appcache', manifest.join('\n'));
    });
}

function bundle(bundles) {
    var moduleObjs = _.chain(bundles).pluck('modules')
        .flatten().uniq().value()
        .map(function(filename) {
            return {filename: filename}; 
        });
    var libObjs = _.chain(bundles).pluck('libs')
        .flatten().uniq().value()
        .map(function(filename) {
            return {filename: filename}; 
        });

    var fileObjs = libObjs.concat(moduleObjs);
    var delayedWriteBundles = util.delaySingleExecAsync(
            function(done) {
       writeBundles(bundles, fileObjs, done);
    });

    async.forEach(libObjs, readFile, function(err, objs) {
    async.forEach(moduleObjs, processFile, delayedWriteBundles);});

    moduleObjs.forEach(function(obj) {
        watchObj(obj, delayedWriteBundles);
    });
}

// ## Generate documentation for itself
function docself() {
    var self = 'scripts/server.js'
    fs.unwatchFile(self);
    spawn('docco', [self]);
    setTimeout(function() { fs.watchFile(self, docself); }, 1000);

}
docself();
spawn('jshint', ['scripts/server.js']);

// # The actual bundles
var base = ["depend/zepto.min.js"];
var oldAndroid = ["depend/es5-shim.min.js","depend/zepto.min.js"];

var legacy = ["depend/es5-shim.min.js",
              "depend/jquery-1.7.1.min.js",
              "depend/json2.min.js"];

var libs = ["depend/modernizr.js",
            "depend/underscore-min.js",
            "depend/backbone-min.js",
            "depend/showdown.min.js",
            "scripts/bundler.js"];

var modules =  ["scripts/util.js",
                "scripts/jsxml.js",
                "scripts/main.js",
                "scripts/showSource.js",
                "scripts/menu.js",
                "scripts/combigame.js",
                "scripts/timelog.js",
                "scripts/demoPlasma.js",
                "scripts/bidiv.js",
                "scripts/webutil.js",
                "scripts/fullbrows.js"];

var bundles = [
    { out: 'apps/combigame/combigame.js',
      libs: oldAndroid.concat(libs),
      modules: modules,
      moduleVersion: 'minified',
      run: 'bundler.require("combigame").run();'},

    { out: 'dist/bundle.debug.js',
      libs: base.concat(libs),
      modules: modules,
      moduleVersion: 'filedata',
      run: 'bundler.require("main").main()'},

    { out: 'dist/bundle.legacy.debug.js',
      libs: legacy.concat(libs),
      modules: modules,
      moduleVersion: 'filedata',
      run: 'bundler.require("main").main()'},

    { out: 'dist/bundle.min.js',
      libs: base.concat(libs),
      modules: modules,
      moduleVersion: 'minified',
      run: 'bundler.require("main").main()'},

    { out: 'dist/bundle.legacy.min.js',
      libs: legacy.concat(libs),
      modules: modules,
      moduleVersion: 'minified',
      run: 'bundler.require("main").main()'}
];

bundle(bundles);

// # Web server

// Start a simple local web server 
var app = require('express').createServer();

app.configure(function(){
    app.use("/", require('express').static(
            __dirname.replace(/\/scripts$/, '')));
});

var port = process.env.PORT || 8080;
app.listen(port);
console.log('\nstarting server on port ' + port + '\n');

})();
