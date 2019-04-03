// Loading express basic modules...


var express = require('express'),
    path = require('path'),
    http = require('http');

// loading middleware...

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    serveStatic = require('serve-static'),
    errorHandler = require('errorhandler');

// using errrorhandler module...
var expressErrorHandler = require('express-error-handler');

// loading session middleware...
var expressSession = require('express-session');

// making express object...
var app = express();

// basic features...
app.set('port', process.env.PORT || 3000);

// parsing application / x-www-form-urlencoded with body-parser
app.use(bodyParser.urlencoded({extended : false}));

// body-parser..
app.use(bodyParser.json());

// public folder open...
app.use('/public', serveStatic(path.join(__dirname, 'public')));

// cookie-parer setting...
app.use(cookieParser());

// sessions setting...
app.use(expressSession({
  secret: 'my key',
  resave : true,
  saveUninitialized : true
}));


// using mongodb
var MongoClient = require('mongodb').MongoClient;


var database;

// connect db...
function connectDB() {
  // connection info....
  var databaseUrl = 'mongodb://16.1.223.62:27017/local';
  
  
  // connet to db...
  MongoClient.connect(databaseUrl, function(err, db){
    if (err) throw err;
    
    console.log('connected to DB... : ' + databaseUrl);
    
    // database variable
    database = db;
  });
}


// router object...
var router = express.Router();

// login routing function - compare with db info...
router.route('/process/login').post(function(req, res){
  console.log('/process/login is called...');
  
});

// register router object...
app.use('/', router);


//==== 404 page handling ====//
var errorHandler = expressErrorHandler({
  serveStatic: {
    '404' : './public/404.html'
  }
});


app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


//===== start server =====//
http.createServer(app).listen(app.get('port'), function(){
  console.log('Server started ...  Port : ' + app.get('port'));
  
  // connect DB...
  connectDB();
});


// authUser()...
var authUser = function(database, id, password, callback) {
  console.log('authUser is called...');
  
  // users collection
  var users = database.collection('users');
  
  // searching with ID and Password..
  users.find({"id" : id, "password" : password}).toArray(function(err, docs){
    if(err) {
      callback(err, null);
      return;
    }
    
    if(docs.length > 0){
      console.log('Found people whose ID [%s], Password [%s] are matched...', id, password);
      callback(null, docs);
    } else {
      console.log('Cannot find people matched...');
      callback(null, null);
    }
  });
  
};


app.post('/process/login', function(req, res){
  console.log('/process/login is called...');
  
  
  var paramId = req.param('id');
  var paramPassword = req.param('password');
  
  if(database) {
    authUser(database, paramId, paramPassword, function(err, docs){
      if(err) {throw err;}
      
      if(docs) {
        console.dir(docs);
        var username = docs[0].name;
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h1>Login Successfully</h1>');
        res.write('<div><p>User ID : ' + paramId + '</p></div>');
        res.write('<div><p>User name : ' + username + '</p></div>');
        res.write("<br><br><a href = '/public/login.html'>Login Again</a>");
        res.end();
      } else {
         res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
         res.write('<h1>Login Failed...</h1>');
         res.write('<div><p>Please Check your ID and Password</p></div>');
         res.write("<br><br><a href = '/public/login.html'>Login Again</a>");
         res.end();
      }
    });
  } else {
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h2>Connect db</h2>');
    res.write('<div><p>DB Connection failed...</p></div>');
    res.end();
  }

});


// function adding users...
var addUser= function(database, id, password, name, callback) {
  console.log('addUser is called... : ' + id + ', ' + password + ', ' + name);
  
  // refer users collection...
  var uses = database.collection('users');
  
  // add user wth id, password, username ...
  users.insertMany([{"id" : id, "password" : password, "name" : name}], 
  function(err, result) {
    if (err) { // returning error object  with calling callback function...
      callback(err, null);
      return;
    }
    
    // if not error, return object with calling callback function...
    if (result.insertCount > 0) {
      console.log("user record is added... : " + result.insertedCount);
    } else {
      console.log("there is added record....");
    }  
    
    callback(null, result);
  });
}


// userAdd router function : add the data sended from client to DB...
router.route('/process/adduser').post(function(req, res){
  console.log('/process/adduser is called...');
  
  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;
  var paramName = req.body.name || req.query.name;
  
  console.log('request parameter : ' + paramId + ', ' + paramPassword + ', ' + paramName);
  
  // if database is initialized...calling addUser function and add a user...
  if (database) {
    addUser(database, paramId, paramPassword, paramName, function(err, result){
      if (err) {throw err;}
      
      // if there are added data, send success response...
      if (result && result.insertedCount > 0) {
        console.dir(result);
        
        res.writeHead('200', {'content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>User added successfully</h2>');
        res.end();
      } else { // if there is no added data...
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>User is not added...</h2>');
        res.end();
      }
    });
  } else { // Fail message is sended if database object is not initailized...
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h2>DB is not connected...</h2>');
    res.end();
  }
});






