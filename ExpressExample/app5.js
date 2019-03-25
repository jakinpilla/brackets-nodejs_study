var express = require('express'),
    http = require('http')

var app = express();

app.use(function(req, res, next){
    console.log('request managed at the first middleware...');
    
    res.redirect('http://google.co.kr');
});

http.createServer(app).listen(3000, function(){
    console.log('Express server started at 3000 port.');
});