var mysql = require('mysql');
var conn = require('./base');


module.exports = {
    CreateFile: function(filepath, callback) {
        var sql = 'insert into `file` set ?';
        conn.query(sql, { filepath: filepath }, function(err, rows, fileids) {
            if (err) {
                console.log(err);
                callback({ error: "数据库出错，请联系管理员或者稍后重试，谢谢！" })
                return;
            }
            console.log(rows, res, fileids);
            callback(err);
        });
    },
    CreateForm: function(filepath, sheetname, callback) {
        var sql = 'insert into `file` set ?';
        conn.query(sql, { filepath: filepath, sheetname: sheetname }, function(err, rows, fileids) {
            if (err) {
                console.log(err);
                callback({ error: "数据库出错，请联系管理员或者稍后重试，谢谢！" })
                return;
            }
            console.log(rows, fileids);
            callback(err);
        });
    },
    DownloadFile: function(fileid, callback) {
        var sql = 'select * from file where ?';
        conn.query(sql, { fileid: fileid }, function(err, rows, fileids) {
            if (err) {
                console.log(err);
                callback({ error: "数据库出错，请联系管理员或者稍后重试，谢谢！" })
                return;
            }
            console.log(rows, fileids);
            callback(err, rows[0].file_path);
        });
    },
    DownloadForm: function(fileid, callback) {
        var sql = 'select * from file where ?';
        conn.query(sql, { fileid: fileid }, function(err, rows, fileids) {
            if (err) {
                console.log(err);
                callback(err)
                return;
            }
            console.log(rows, fileids);
            callback(err, rows);
        });
    },
    GetFilesInfo: function(filter, callback) {
        var sql = 'select * from file where ?';
        conn.query(sql, filter, function(err, rows, fileids) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }
            console.log(rows, fileids);
            callback(err, rows);
        });
    }
}