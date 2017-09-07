var conn = require('./base');

module.exports = {
    GetScholarInfo: function(userid, callback) {
        var sql = 'select * from doc,user where user.userid = doc.comment_by?';
        conn.query(sql, { userid: userid }, function(err, rows, fileids) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }
            console.log(rows);
            callback(err, rows);
        });
    }
}