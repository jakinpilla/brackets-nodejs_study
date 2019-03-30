// loading basic modules...
var express = require('express'),
    http = require('http'),
    path = require('path');

// loading Express middlewares...
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    serveStatic = require('serve-static'),
    errorHandler = require('errorhandler');

// error  handler module...
var expressErrorHandler = require('express-error-handler');

// loading session middlewares...
var expressSession = require('express-session');

// making a experss object...
var app = express();

// setting basic features...
app.set('port', process.env.PORT || 3000);

// with body-parser, parsing application/x-www-form-urlencoded...
app.use(bodyParser.urlencoded({extended : false}));

// with body-parser, parsing application/json...
app.use(bodyParser.json());

// open the "public" folder as serveStatic folder... 
app.use('/public', serveStatic(path.join(__dirname, 'public')));

// setting cookie-parser...
app.use(cookieParser());

// setting session...
app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveUninitialized : true
}));

// router object...
var router = express.Router();

// Login router function - to compare database information...
router.route('/process/login').post(function(req, res){
    console.log('/process/login is called...');
    
    
});


// register router object...
app.user('/', router);


//==== 404 error page =====//
var errorHandler = expressErrorHandler({
    static: {
        '404' : './public/404.html'
    }
});

app.user(expressErrorHandler.httpError(404));
app.use(errorHandler);

//==== Start Server ====//
http.createServer(app).listen(app.get('port'), function(){
    console.log('Server is started... Port : ' + app.get('port'));
});















