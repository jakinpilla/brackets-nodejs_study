var fs = require('fs');
fs.mkdir('./docs', 0666, function(err){
    if(err) throw err;
    console.log('created new docs folder.');
    
    fs.rmdir('./docs', function(err){
        if(err) throw err;
        console.log('removed docs folder.');
    });
});