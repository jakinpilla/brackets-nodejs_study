var express = require('express'),
    http = require('http')

var app = express();

app.use(function(req, res, next){
    console.log('request managed at the first middleware...');
    
    var userAgent = req.header('User-Agent');
    var paramName = req.query.name;
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>This is the response result from Express server</h1>');
    res.write('<div><p>User-Agent : ' + userAgent + '</p></div>');
    res.write('<div><p>Param name : ' + paramName + '</p></div>');
    res.end();
    
});

http.createServer(app).listen(3000, function(){
    console.log('Express server started at 3000 port.');
});
