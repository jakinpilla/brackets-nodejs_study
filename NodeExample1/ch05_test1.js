var http = require('http');

// to make WAS object
var server = http.createServer();

// to start WAS and wait t0 listen at 'o192.168.0.5' and 3000 port
var host = '192.168.0.5'
var port = 3000;
server.listen(port, function() {
    console.log('WAS begins: %d', port);
});