var http = require('http');

var options = {
    host: 'www.google.com',
    post: 80,
    path: '/'
};

var req = http.get(options, function(res){
    // manage response...
    var resData = '';
    res.on('data', function(chunk){
        resData += chunk;
    });
    
    res.on('end', function(){
        console.log(resData);
    });
});

req.on('error', function(err){
    console.log('occure error...: ' + err.message);
});

