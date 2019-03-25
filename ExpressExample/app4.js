var express = require('express'),
    http = require('http')

var app = express();

app.use(function(req, res, next){
    console.log('request managed at the first middleware...');
    
    res.send({name : '소녀시대', age:20});
});

http.createServer(app).listen(3000, function(){
    console.log('Express server started at 3000 port.');
});