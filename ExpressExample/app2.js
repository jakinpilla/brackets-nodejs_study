var express = require('express'),
    http = require('http')

var app = express();

app.use(function(req, res, next){
    console.log('request managed at the first middleware...');
    
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.end('<h1>This is the result of Express server.</h1>');
});

http.createServer(app).listen(3000, function(){
    console.log('Express server started at 3000 port.');
});