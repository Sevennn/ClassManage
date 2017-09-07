var conn = require('./base');

module.exports = {
    GetScholarInfo: function(userid, callback) {
        var sql = 'select * from doc,user where user.userid = doc.comment_by and doc.userid = ?';
        conn.query(sql, [userid], function(err, rows, fileids) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }
            console.log(rows);
            callback(err, rows);
        });
    },
    CreateScholarInfo: function(userid, fileid, callback) {
        var sql = 'insert into doc set ?';
        conn.query(sql, { userid: userid, file_id: fileid }, function(err, rows, fileids) {
            if (err) {
                callback(err);
                return;
            }
            callback(err, rows);
        })
    },
    GetScholarFileId: function(userid, callback) {
        var sql = 'select * from doc where userid = ?';
        conn.query(sql, [userid], function(err, rows, fileids) {
            if (err) {
                callback(err);
                return;
            }
            callback(err, rows);
        })
    },
    GetExaminee: function(callback) {
        var sql = 'select username, user.userid from doc, user where doc.userid = user.userid and doc.comment_by is null';
        conn.query(sql, function(err, rows, fileids) {
            if (err) {
                callback(err);
                return;
            }
            callback(err, rows);
        })
    },
    GetExaminer: function(callback) {
        var sql = 'select username, userid from user where role = 0';
        conn.query(sql, function(err, rows, fileids) {
            if (err) {
                callback(err);
                return;
            }
            callback(err, rows);
        })
    }
}