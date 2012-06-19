// # Simple business-card home&nbsp;page
var $ = require('zquery');
exports.app = {
    update: function() {
        // content of the page as jsonml with inline style
        this.$.html(require('jsxml').toXml(['div',
            {id: 'rasmuserik', style: 'width: 85%; height: 100%; position: absolute'},
            ['div', {style: 'font-size: 200%; padding: 2ex 0pt 0pt 5%;'},
                'Rasmus Erik @ solsort.dk'],
            ['div', {style: 'font-size: 95%; margin-top: -0.5ex;' +
                          'padding: 0pt 0pt 0pt 5%;'},
                'Muldager 32 2th, DK-2700 Brønshøj. +45 60703081'],
            ['div', {style: 'font-size: 150%; padding: 2ex 0 2ex 5%;'},
                '- software developer at DBC a/s,', ['br'],
                'and freelance computer scientist.'],
            ['div', {'class': 'section', style: 'font-size: 80%; padding: 0 0 2ex 0'},
                'Current areas of focus:',
                ['div', 'Mobile and web-apps • development, teaching, and strategy'],
                ['div', 'Open Source • infrastructure, and reusing existing solutions'],
                ['div', 'JavaScript • consulting, best practises, and scripting engines' ]]]));
        // indent sub-sections
        $('.section div').css('padding', '1ex 0 0 5%');
        // no line wraps
        $('#content div').css('white-space', 'nowrap');
        // shorthand + optimisation
        var $rasmuserik = $('#rasmuserik');
        // limit business-card to a maximum size of 500px width, and center it on the page
        if($rasmuserik.width() > 500) {
            $rasmuserik.css({
                left: ($rasmuserik.width()-500)>>1,
                width: 500
            });
        }
        // scale the text according to available space
        require('webutil').scaleText($rasmuserik);

        // 1/4 of the empty space above, 3/4 of the empty space below
        $rasmuserik.css('height', 'auto');
        $rasmuserik.css({
            'top': (this.$.height() - $rasmuserik.height())>>2,
            overflow: 'visible', marginLeft: '5%'
        });
    }
};
