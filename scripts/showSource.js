/*34567890123456789012345678901234567890123456789012345678901234567890123456*/
var $ = require('zquery');
var _ = require('underscore');
var console = require('console');

var doccoLineRegEx = /^\s*\/\/( |$)/;
function isDoccoComment(line) {
    return line.match(doccoLineRegEx);
}

function docco(text) {
    var i;
    var showdown = require('showdown');
    showdown = new showdown.converter();

    text = text.split('\n');
    var result = [];
    var current = [];
    var prevIsDocco = true;

    var lineno = 0;
    text.forEach(function(line) {
        var currentIsDocco = !!isDoccoComment(line);

        if(currentIsDocco) {
            line = line.replace(doccoLineRegEx, '');
        } else {
            line = {lineno: lineno, line: line};
        }

        if(prevIsDocco === currentIsDocco) {
            current.push(line);
        } else {
            result.push(current);
            current = [line];
        }
        prevIsDocco = currentIsDocco;
        ++lineno;
    });
    result.push(current);
    if(result.length & 1) {
        result.push([]);
    }

    var docs = [];
    var code = [];
    for(i = 0; i < result.length; i += 2) {
        docs.push(result[i]);
        code.push(result[i+1]);
    }
    docs = docs.map(function(doc) { return '<div class="docblock">' + showdown.makeHtml(doc.join('\n')) + '</div>'; });
    code = code.map(function(code) {
        return '<div class="codeblock">' + code.map(function(code) {
            return '<div><span class="lineno">' + (1+code.lineno) + ' </span> ' + _.escape(code.line) + '</div>';
        }).join('') + '</div>';
    });

    //result = ['<table>'];
    result = [];
    for(i = 0; i < docs.length; ++i) {
    //    result.push('<tr><td style="vertical-align: top">');
        result.push(docs[i]);
    //    result.push('</td><td style="vertical-align: top">');
        result.push(code[i]);
    //    result.push('</td></tr>');
    }
    //result.push('</table>');
    return result.join('');

}

function style(app) {
    var w = app.$.width();
    $('.lineno').css({
        fontSize: '50%',
        width: '4ex',
        color: '#ccc',
        'vertical-align': '0.5ex',
        display: 'inline-block',
        textAlign: 'right'
    });
    $('.codeblock div').css({
        whiteSpace: 'pre-wrap',
        textIndent: '.5ex',
        //fontFamily: app.mobile?'Ubuntu Condensed':'Ubuntu Mono'
        //fontFamily: 'Ubuntu Mono'
        fontFamily: 'Ubuntu Mono'
    });
    $('.docblock').css({
        marginTop: app.mobile?'.1pt':'2pt',
        borderTop: app.mobile?'none':'1px solid #eee',
        'vertical-align': 'top',
        display: 'inline-block',
        marginLeft: w*0.02|0,
        width: (app.mobile?w*0.95:w*0.45)|0
    });
    $('.codeblock').css({
        marginTop: app.mobile?'.1pt':'2pt',
        borderTop: app.mobile?'none':'1px solid #eee',
        'vertical-align': 'top',
        display: 'inline-block',
        fontSize: Math.max(app.$.width() / 45 * (app.mobile?1:0.5), 8),
        width: app.mobile?w:w>>1
    });

}

exports.app = {
    type: 'scrollable',
    start: function() {
        var app = this;
        $.ajax({
            url: ('/scripts/' + this.param + '.js'),
            dataType: 'text',
            success: function(text) {
                app.$.html(docco(text));
                style(app);
            }
        });
    },
    update: function() {
        style(this);
    }
};
