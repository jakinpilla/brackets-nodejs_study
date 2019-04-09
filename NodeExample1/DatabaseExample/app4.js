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

// load mongoose module...
var mongoose = require('mongoose');

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
  
  // 1. search with ID...
  UserModel.findById(id, function(err, results) {
    if(err) {
      callback(err, null);
      return;
    }
    
    console.log('ID [%s] search result...', id);
    console.dir(results);
    
    if(results.length > 0) {
      console.log('there is someone matched...');
      
      // 2. password check...
      if(results[0]._doc.password === password) {
        console.log('password is matched...');
        callback(null, results);
        } else {
          console.log('password is not matched...');
          callback(null, null);
        }
        
      } else {
        console.log('there is no one matched...');
        callback(null, null);
        
      }
  });

}


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
  
  // UserModel instance...
  var user = new UserModel({"id" : id, "pasword" : password, "name" : name});
  
  // save() 
  user.save(function(err) {
    if (err) {
      callback(err, null);
      return;
    }
    
    console.log("User data added...");
    callback(null, user);
  });
};


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


// Proclaim database object...
var database;

// Proclaim  DB schema object...
var UserSchema;

// Proclaim DB Model object...
var UserModel;

// Connect to DB...
function connectDB() {
  // DB connection info...
  var databaseUrl = 'mongodb://localhost:27017/local';
  
  // connect to DB...
  console.log('Try to DB...');
  mongoose.Promise= global.Promise;
  mongoose.connect(databaseUrl);
  database = mongoose.connection;
  
  database.on('error', console.error.bind(console, 'mongoose connection error.'));
  database.on('open', function() {
    console.log('DB connected.... : ' + databaseUrl);
    
    // Define Schema...
    UserSchema = mongoose.Schema({
      id : String,
      name : String,
      password : String
    });
    console.log('UserSchema is defined...');
    
    // Define UserModel...
    UserModel = mongoose.model("users", UserSchema);
    console.log('UserModel is defined...');
  });
  
  // when disconnected, retry to connect in 5 sec...
  database.on('disconnected', function() {
    console.log('Disconnected... retry to connect in 5 sec...');
    setInterval(connectDB, 5000);
  });
  
}

// Define Schema
UserSchema = mongoose.Schema({
  id : {type : String, require : true, unique : true},
  password : {type : String, required : true},
  age : {type : Number, 'default' : -1},
  created_at : {type : Date, index : {unique : false}, 'default' : Date.now},
  updated_at : {type : Date, index : {unique : false}, 'default' : Date.now}
});

// static() method added...
UserSchema.static('findById', function(id, callback) {
  return this.find({id : id}, callback);
});

UserSchema.static('findAll', function(callback) {
  return this.find({ }, callback);
});

console.log('UserSchema is defined...');

// UserModel defining...
UserModel= mongoose.model("users2", UserSchema);
console.log('UserModel is defined....');


// user list function...
router.route('/process/listuser').post(function(req, res) {
  console.log('/process/listuser is called...');
  
  // DB object is initialized, calling findAll() method...
  if (database) {
    // 1. search all users...
    UserModel.findAll(function(err, results)  {
      // when error occur, transfer error to client... 
      if (err) {
        console.error('error occur when user list search...' + err.stack);
        
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
        res.write('<p>' + err.stack + '</p>');
        res.end();
        
        return;
      }
      
      if(results) { // If there is result list, send list...
        console.dir(results);
        
        res.writeHeada('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>User list</h2>');
        res.write('<div><ul>');
        
        for (var i = 0; i < results.length; i++) {
          var curId = results[i]._doc.id;
          var curName = results[i]._doc.name;
          res.write(' <li>#' + i + ' : ' + curId + ', ' + curName + '</li>');
        }
        
        res.write('</ul></div>');
        res.end();
      } else {
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>There is no user in the list</h>');
        res.end();
      }
    });
  } else { // If there is no result list, send fail response...
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h2>DB connection failed...</h2>');
    res.end();
  }
});
