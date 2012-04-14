var tokenRegEx = RegExp.call(RegExp, '\\s*(\\[|\\]|(\\\\.|[^\\s\\[\\]])+)', 'g');
var unescapeRegEx = RegExp.call(RegExp, '\\\\(.)', 'g');
yolan = {};
yolan.tokenize = function(str) {
    var result = [];
    !str.replace(tokenRegEx, function(_, token) {
        result.push(token);
    });
    return result;
}
yolan.parse = function(tokens) {
    tokens = tokens.reverse();
    var stack = [];
    var current = ['do'];
    var t;
    while(tokens.length) {
        var token = tokens.pop();
        if(token === '[') {
            stack.push(current);
            current = [];
        } else if(token === ']') {
            t = current;
            current = stack.pop();
            current.push(t);
        } else {
            current.push(token.replace(unescapeRegEx, function(_,a) { return a; }));
        }
    }
    if(stack.length !== 0) {
        throw 'unterminated "["'
    }
    return current;
}

var compileJS= {
    JsTypeOf: function(syn, syn1) { return 'typeof ' + syn1; },
    'do': function(syn, syn1) { return syn.slice(1).map(yolan.toJS).join(';'); },
    def: function(syn, syn1) { return 'var ' + syn1 + '=' + yolan.toJS(syn[2]); },
    set: function(syn, syn1) { return '' + syn1 + '=' + yolan.toJS(syn[2]); },
    'object': function(syn, syn1) { return '{'+ 
        syn.slice(1).map(function(pair) {
                return JSON.stringify(pair[0].toString()) + ':' + yolan.toJS(pair[1]);
        }).join(',') +'}'; 
    } ,
    'array': function(syn, syn1) { return '[' + syn.slice(1).map(yolan.toJS).join(',') + ']'; }, 
    'fn': function(syn, syn1) { return 'function(' + syn1.join(',') + '){' + syn.slice(2, -1).map(yolan.toJS).join(';')  + ';return ' +yolan.toJS(syn[syn.length -1])+ '}'; }, 
    'while': function(syn, syn1) { return 'while(' + yolan.toJS(syn1) + '){' + syn.slice(2).map(yolan.toJS).join(';') + '}'; }, 
    'cond': function(syn, syn1) { return syn.slice(1).map(function(cond) { return 'if(' + yolan.toJS(cond[0]) + '){' + cond.slice(1).map(yolan.toJS).join(';') + '}'; }).join('else '); }, 
    '#': function(syn, syn1) { return ''; }, 
    'return': function(syn, syn1) { return 'return ' + yolan.toJS(syn1); }, 
    //'"': function(syn, syn1) { return JSON.stringify(syn.slice(1).join(' ')); },
    '+': function(syn, syn1) { return syn.slice(1).map(yolan.toJS).join('+'); },
    'eq?': function(syn, syn1) { return yolan.toJS(syn[1]) + '===' + yolan.toJS(syn[2]) } 
}

yolan.toJS = function(syn) {
    var syn0 = syn[0];
    var len = syn.length;
    var syn1 = syn[1];
    if(typeof(syn) === 'string') {
        return syn;
    }
    if(compileJS[syn0]) {
        return compileJS[syn0](syn, syn1);
    }
    if(syn1 === 'set') {
        return syn0 + '.' + syn[2] + '=' + yolan.toJS(syn[3]);
    }
    if(syn1 === 'get') {
        if(typeof syn[2] === 'string') {
            return syn0 + '["' + syn[2] + '"]';
        } else {
            return syn0 + '[' + yolan.toJS(syn[2]) + ']';
        }
    }
    if(typeof syn[1] === 'string') {
        return yolan.toJS(syn0) + '.' + syn1 + '(' + syn.slice(2).map(yolan.toJS).join(',') + ')';
    } else {
        return yolan.toJS(syn0) + '[' + yolan.toJS(syn1) + '](' + syn.slice(2).map(yolan.toJS).join(',') + ')';
    }
}

require.call(null, 'fs').readFile('yolan.yl', 'utf8', function(err, data) {
    if(err) return err;
    var tokens = yolan.tokenize(data);
    var ast = yolan.parse(tokens);
    var js = yolan.toJS(ast);
    console.log();
    console.log(js);
    console.log();
    eval(js);
});
