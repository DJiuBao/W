var util = require('util');
var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/xml2js.xml', function(err, data) {
    parser.parseString(data, function (err, result) {

        //console.dir(result);
        //console.log('result = ' + util.inspect(result,false,null));
        
        //console.log(result.Message.$.MsgCode);
        //console.log(result.Message.Info[0].datatime);

        console.log('Done');
    });
});