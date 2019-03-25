// load Expess module...

var express = require('express'),
    http = require('http');

// make a express object...
var app = express()

// set basic port at app object as a feature of app object...
app.set('port', process.env.PORT || 3000);

// start Express server...
http.createServer(app).listen(app.get('port'), function(){
    console.log('start express server...: ' + app.get('port'));
});

