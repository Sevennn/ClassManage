var mysql = require('mysql');
var conn = require('./base');


module.exports = {
    /** 
     * @param {string} filepath specify the path of file
     * @param {function} callback callback function with (err, result) as param
     */
    CreateFile: function(filepath, callback) {
        var sql = 'insert into `file` set ?';
        conn.query(sql, { file_path: filepath }, function(err, rows, fileids) {
            if (err) {
                console.log(err);
                callback({ error: "数据库出错，请联系管理员或者稍后重试，谢谢！" })
                return;
            }
            console.log(rows, fileids);
            callback(err, rows.insertId);
        });
    },
    /**
     * @param {string} filepath specify the path of file
     * @param {string} sheetname specify the name of sheet
     * @param {function} callback callback function with (err, result) as param
     */
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
    /**
     * @param {Number} fileid specify the id of file
     * @param {function} callback callback function with (err, result) as param
     */
    DownloadFile: function(fileid, callback) {
        var sql = 'select * from file where ?';
        conn.query(sql, { fileid: fileid }, function(err, rows, fileids) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }
            console.log(rows, fileids);
            callback(err, rows[0].file_path);
        });
    },
    /**
     * @param {Number} fileid specify the id of file
     * @param {function} callback callback function with (err, result) as param
     */
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
    /**
     * @param {Number} filter to specify which file you want with four attr: fileid,filepath,sheetname,type
     * @param {function} callback callback function with (err, result) as param.
     */
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