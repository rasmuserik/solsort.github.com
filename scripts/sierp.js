// Experiment in minimalism, how small can you write a program that draws a sierpinsky triangle...
/*jshint curly: false, asi:true, expr:true */
// App setup.
exports.app = {
    underbar: true,
    type: 'canvas',
    start: function() {
        var a,b,c,i,t;
        // Make a js1k-like context, - see http://js1k.com/.
        c = this.elem;
        a = c.getContext('2d');
        // Set canvas size, for better picture. Works fine without, albeit smaller.
        c.width = c.height = 1000;
        // The actual program. 72 bytes :)
        t=999;for(b=[i=1];i<t*t;)(b[i+t]=b[i]^b[i++-1])&&a.fillRect(i%t,i/t,1,1)
        //
    }
};
