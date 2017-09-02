var MongoClient = require('mongodb').MongoClient;
var db_con = 'mongodb://localhost:27017/class_db';
var ExcelWriter = require("./excelHandler");
module.exports = {
    insertForm: function(formName, callback) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('form');
            var data = [{
                'fileName': formName,
                'id': string((new Date()).getTime())
            }];
            collection.insert(data, function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                db.close();
                callback(result);
            })
        })
    },
    getFormid: function(formName, callback) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('form');
            var filter = {
                'fileName': formName
            };
            collection.find(filter).toArray(function(err, doc) {
                console.log(doc);
                callback(doc[0]['_id']);
                db.close();
            });
        })
    },
    getFormname: function(formid, callback) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('form');
            var filter = {
                'id': formid
            };
            console.log(formid);
            collection.find(filter).toArray(function(err, doc) {
                console.log(doc);
                callback(doc[0]['fileName']);
                db.close();
            });
        })
    },
    getForms: function(callback) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('form');
            collection.find().toArray(function(err, doc) {
                console.log(doc);
                callback(doc);
                db.close();
            });
        })
    },
    InsertUserData: function(data, callback) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('userData');
            collection.insert(data, function(err, res) {
                console.log(res);
                callback(res);
            });
        })
    },
    GetExcelFile: function(id, cb) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('userData');
            var filter = {
                'formid': id
            }
            console.log(id);
            collection.find(filter).toArray(function(err, res) {
                console.log(res);
                ExcelWriter.MakeFile(res, cb);
            })
        })
    },
    UserLogin: function(user, cb) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(user);
            var collection = db.collection('user');
            var filter = {
                'userid': user.id,
                'password': user.password
            }
            collection.find(filter).toArray(function(err, res) {
                console.log(res);
                cb(res);
            })
        })
    },
    AdminLogin: function(user, cb) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(user);
            var collection = db.collection('admin');
            var filter = {
                'userid': user.id,
                'password': user.password
            }
            collection.find(filter).toArray(function(err, res) {
                console.log(res);
                cb(res);
            })
        })
    },
    UpdatePsw: function(userid, oldPsw, newPsw, cb) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }

            var collection = db.collection('user');
            var filter = {
                'userid': userid,
                'password': oldPsw
            }
            collection.update(filter, { $set: { 'password': newPsw } }, function(err, res) {
                if (err) {
                    console.log(err);
                    return;
                }
                cb(res);
            })
        })
    }
}