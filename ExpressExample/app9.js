var express = require('express'),
    http = require('http'),
    path = require('path');

// loading middleware...
var bodyParser = require('body-parser'),
    serveStatic = require('serve-static');

// error handler module...
var expressErrorHandler = require('express-error-handler');

var app = express();

// setting basic features...
app.set('port', process.env.PORT || 3000);

// application/x-www-form-urlencoded parsing using body-parser...
app.use(bodyParser.urlencoded({extended : false}));

// application/json parsing...
app.use(bodyParser.json());

app.use(serveStatic(path.join(__dirname, 'public')));

/* param check in middleware...
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
*/

// refer router object ...
var router = express.Router();

// to register a routing function...
router.route('/process/login').post(function(req, res){
    console.log('/process/login processed...');
    
    var paramId = req.body.id | req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>This is the response result from Express server</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write("<br><br><a href = '/public/login2.html' back to the login page</a>");
    res.end();
    
});


// register a router object to app object....
app.use('/', router);

// 404 error page process after all router preocess ended...
var errorHandler= expressErrorHandler({
    static : {
        '404' : './ExpressExample/public/404.html'
    }
});


app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(3000, function(){
    console.log('Express server started at 3000 port.');
});
