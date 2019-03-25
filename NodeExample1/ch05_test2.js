var http = require('http');

var server = http.createServer();

var port = 4000;
server.listen(port, function(){
    console.log('WAS begins...at : %d', port);
});

server.on('connection', function(socket){
    var addr = socket.address();
    console.log('client accessed...: %s, %d', addr.address, addr.port);
});

server.on('request', function(req, res){
    console.log('Clients requests come...');
    
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.write("<!DOCUTYPE html>");
    res.write("<html>");
    res.write(" <head>")
    res.write("     <title>Response Page</title>");
    res.write(" </head>");
    res.write(" <body>");
    res.write("     <h1>Response Page from Node.js</h1>");
    res.write(" </body>");
    res.write("</html>");
    res.end();
});

server.on('close', function(){
    console.log('WAS closed...');
});