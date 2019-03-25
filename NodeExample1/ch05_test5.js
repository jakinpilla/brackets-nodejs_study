var http = require('http');
var fs = require('fs');

var server = http.createServer();

var port = 3000;
server.listen(port, function(){
    console.log('WAS begins...at : %d', port);
});

server.on('connection', function(socket){
    var addr = socket.address();
    console.log('client accessed...: %s, %d', addr.address, addr.port);
});

server.on('request', function(req, res){
    console.log('Client request come...');
    
    var filename = './NodeExample1/seho_1.jpg';
    fs.readFile(filename, function(err, data){
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.write(data);
        res.end();
    });
});

server.on('close', function(){
    console.log('WAS closed...');
});




