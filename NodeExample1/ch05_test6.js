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
    var infile = fs.createReadStream(filename, {flags: 'r'});
    var filelength = 0;
    var curlength = 0;
    
    fs.stat(filename, function(err, stats){
        filelength = stats.size;
    });
    
    // to write header
    res.writeHead(200, {'Content-Type': 'image/jpg'});
    
    // to read file contents from stream and write contents
    infile.on('readable', function(){
        var chunk;
        while (null != (chunk = infile.read())) {
            console.log('The size of data which has been read... %d byte', chunk.length);
            curlength += chunk.length;
            res.write(chunk, 'utf8', function(err){
                console.log('file writing has been finished! : %d', curlength, filelength);
                if (curlength >= filelength) {
                    //send response
                    res.end();
                    }
            });
        }
    });
     8
});

server.on('close', function(){
    console.log('WAS closed...');
});




