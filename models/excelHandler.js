var fs = require('fs');
var xl = require('node-xlsx');
var path = require('path');
module.exports = {
    MakeJade: function(filename, callback) {

        var filepath = path.join(__dirname, '../public/data/excels', filename);
        var tmp = xl.parse(filepath);
        var keys = tmp[0].data[0];
        callback(keys);
    },
    MakeFile: function(udata, callback) {
        console.log(udata);
        var data = [];
        var obj = udata[0];
        var keyValues = [];
        for (let key in obj) {
            keyValues.push(key);
        }
        console.log(keyValues);
        data.push(keyValues);
        for (let j = 0; j < udata.length; j++) {
            var tmp = [];
            for (let i = 0; i < keyValues.length; i++) {
                console.log(keyValues[i]);
                console.log(udata[j][keyValues[i]]);
                tmp.push(udata[j][keyValues[i]]);
            }
            data.push(tmp);
        }
        console.log(data);
        var buffer = xl.build([{ name: 'sheet', data: data }]);
        var filename = (new Date).getTime();
        fs.writeFileSync(path.join(__dirname, '../public/data/excels', filename + '.xlsx'), buffer, 'binary');
        callback(filename + '.xlsx');
    }
}