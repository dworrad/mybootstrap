(function(){

    var originalGlobals = Object.keys(global);

    setTimeout(function() {
        var leaks, globals2;

        globals2 = Object.keys(global);
        leaks    = [];

        globals2.forEach(function(key) {
            if (originalGlobals.indexOf(key) === -1) {
                leaks.push(key);
            }
        });

        console.log('LEAKS', leaks.join(', '));
    }, 1000);

    var locomotive = require('locomotive')
    var env = process.env.NODE_ENV || 'development'
    var port = process.env.PORT || 3000
    var address = '0.0.0.0';

    locomotive.boot(__dirname, env, function(err, server) {
        if (err) { throw err; }
        server.listen(port, address, function() {
            var addr = this.address();
            console.log('listening on %s:%d', addr.address, addr.port);
        });
    });
    

}());