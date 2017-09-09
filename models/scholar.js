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
    CheckExist: function(userid, callback) {
        var sql = `select * from doc where userid = ${userid}`;
        conn.query(sql, (err, rows, fileids) => {
            callback(err, rows);
        })
    },
    GetScholarFileId: function(userid, callback) {
        var sql = 'select * from doc,user where doc.userid = ? and doc.comment_by = user.userid';
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
            callback(err, rows);
        })
    },
    GetScholarTask: function(userid, callback) {
        var sql = `select * from scholar_task, user where scholar_task.examiner = ${userid} and user.userid = scholar_task.examinee`;
        conn.query(sql, function(err, rows, fileids) {
            callback(err, rows);
        });
    },
    GetScholarExamineeInfo: function(userid, callback) {
        var sql = `select doc.comment,doc.userid,doc.point,doc.file_id, user.username from doc,user where doc.userid = ${userid} and user.userid = doc.comment_by;`;
        console.log(sql);
        conn.query(sql, function(err, rows, fileids) {
            callback(err, rows);
        });
    },
    UpdateComment: function(userid, point, comment, callback) {
        var sql = `update doc set comment = '${comment}',point = ${point} where userid = ${userid}`;
        conn.query(sql, (err, rows, fileids) => {
            console.log(err);
            callback(err, rows, fileids);
        });
    },
    GetAllInfo: function(callback) {
        var sql = 'select * from doc,user where point > 0 and user.userid = doc.userid';
        conn.query(sql, (err, rows, fileids) => {
            callback(err, rows);
        })
    }
}