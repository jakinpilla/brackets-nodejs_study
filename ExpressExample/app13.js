var express = require('express'),
    http = require('http'),
    path = require('path');

// loading middleware...
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    serveStatic = require('serve-static'),
    errorHandler = require('errorhandler');

// error handler module...
var expressErrorHandler = require('express-error-handler');

// Loding session middleware...
var expressSession = require('express-session');

// file upload middleware...
var  multer = require('multer');
var fs = require('fs')

// ajax multi core support...
var cors = require('cors')

// making express object...
var app = express();

// setting basic features...
app.set('port', process.env.PORT || 3000);

// application/x-www-form-urlencoded parsing using body-parser...
app.use(bodyParser.urlencoded({extended : false}));

// application/json parsing...
app.use(bodyParser.json());

// open public folder and upload folder...
app.use('/public', serveStatic(path.join(__dirname, 'public')));
app.use('/uploads', serveStatic(path.join(__dirname, 'uploads')));

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

// setting cookieParser...
app.use(cookieParser());

// setting session...
app.use(expressSession({
    secret: 'My key',
    resave : true,
    saveUninitialized: true
}));


// ajax multi core support...
app.use(cors());

// use multer middleware...
// middleware using order is important :: body-parser -> multer -> router...
// file limit 10, 1G
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname + Date.now())
    }
});

var upload = multer({
    storage: storage,
    limits :{
        files : 10,
        fileSize : 1024 * 1024 * 1024
    }
});

// refer router object ...
var router = express.Router();

// to register a routing function...

router.route('/process/photo').post(upload.array('photo', 1), function(req, res){
    console.log('/process/photo is called...');
    
    try {
        var files = req.files;
        
        console.dir('#===== The file information uploaded ====#')
        console.dir(req.files[0]);
        console.dir('#====#')
        
        // var which will contain file information...
        var originalname = '',
            filename = '',
            mimetype = '',
            size = 0;
        
        if (Array.isArray(files)) { // in case when array is included...(1 file can be included too...)
            console.log("Flie number which is included in the array: %d", files.length);
            
            for(var index = 0; index < files.length; index++) {
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
        } else { // in case when the array is not included...
            console.log('file number : 1');
            originalname = files[index].originalname;
            filename = files[index].name;
            mimetype = files[index].mimetype;
            size = files[index].size;
        }
        
        console.log('present file information : ' + originalname + ', ' + filename + ', '
               + mimetype + ', ' + size);
        
        // transmit client response
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf-8'});
        res.write('<h3>File uploaded successfully...</h3>');
        res.write('<hr/>');
        res.write('<p>Raw file name : ' + originalname + ' -> saved file name : ' + filename  + '</p>');
        res.write('<p>MIME TYPE : ' + mimetype + '</p>');
        res.write('<p> File Size : ' + size + '</p>');
        res.end();
    
    } catch(err) {
        console.dir(res.stack);
    }
});


/* router.route('/process/showCookie').get(function(req, res){
    console.log('/process/showCookie is called...');
    
    res.send(req.cookies);
});


router.route('/process/setUserCookie').get(function(req, res){
    console.log('/process/setUserCookies is called...');
    
    // setting cookies...
    res.cookie('user', {
        id: 'mike',
        name : 'Girls Generation',
        authorized : true
    });
    
    // response with redirect...
    res.redirect('/process/showCookie');
});


router.route('/process/product').get(function(req, res){
    console.log('/process/product is called...');
    
    if(req.session.user){
        res.redirect('/public/product.html');
    } else {
        res.redirect('/public/login2.html');
    }
});


*/

// register a router object to app object....
app.use('/', router);

// 404 error page process after all router preocess ended...
/* var errorHandler= expressErrorHandler({
    static : {
        '404' : './ExpressExample/public/404.html'
    }
});


app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
*/


// login routing function - save session after login...

/*
router.route('/process/login').post(function(req, res){
    console.log('/process/login is called...');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    if (req.session.user) {
        // already logined...
        console.log('move to prouct page because already logined...');
        
        res.redirect('/public/product.html');
    } else {
        // save session...
        req.session.user = {
            id : paramId,
            name : "Girls Generation",
            authorized : true
        };
        
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>Login Successfully...</h1>');
        res.write('<div><p>Param id : ' + paramId + '</p></div>');
        res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
        res.write("<br><br><a href = '/process/product'> move to the product page</a>"); // Cannot GET /public/product.html...
        res.end();
    }
});

*/

// Delete logout session...

/*
router.route('/process/logout').get(function(req, res){
    console.log('/process/logout is called....');
    
    if (req.session.user) {
        // login status...
        console.log('log out...');
        
        req.session.destroy(function(err){
            if (err) {throw err;}
            
            console.log('delete session and logout...');
            res.redirect('/public/login2.html');
                        
        });
    } else {
        // not logined...
        console.log('Not yet logined...');
        res.redirect('/public/login2.html');
    }
});
*/

http.createServer(app).listen(3000, function(){
    console.log('Express server started at 3000 port.');
});
