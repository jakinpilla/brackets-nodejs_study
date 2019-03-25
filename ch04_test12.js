var fs = require('fs');

var inname = './NodeExample1/output.txt';
var outname = './NodeExample1/output2.txt';

fs.exists(outname, function(exists){
    if(exists) {
        fs.unlink(outname, function(err){
            if(err) throw err;
            console.log('기존 파일 [' +  outname + '] 삭제함.');
        });
    }
    var infile = fs.createReadStream(inname, {flags: 'r'});
    var outfile = fs.createWriteStream(outname, {flags: 'w'});
    infile.pipe(outfile);
    console.log('파일복사 [' + inname + '] -> [' + outname + ']');
});