var express = require('express'),
    http = require('http'),
    path = require('path');

// loading middleware...
var bodyParser = require('body-parser'),
    serveStatic = require('serve-static');

var app = express();

// setting basic features...
app.set('port', process.env.PORT || 3000);

// application/x-www-form-urlencoded parsing using body-parser...
app.use(bodyParser.urlencoded({extended : false}));

// application/json parsing...
app.use(bodyParser.json());

app.use('/ExpressExample/public', serveStatic(path.join(__dirname, 'ExpressExample/public')));

// param check in middleware...
app.use(function(req, res, next){
    console.log('request managed at the first middleware...');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>This is the response result from Express server</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.end();
    
});

http.createServer(app).listen(3000, function(){
    console.log('Express server started at 3000 port.');
});
