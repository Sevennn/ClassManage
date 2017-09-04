var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');
var CONFIG = require('../config.js');
var db_con = CONFIG.MONGO_URL;
var ExcelWriter = require("./excelHandler");
module.exports = {
    InsertForm: function(fileName, formName, callback) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('form');
            var data = [{
                'formname': formName,
                'filename': fileName,
                'fileid': ((new Date()).getTime()) + ''
            }];
            console.log(data);
            collection.insert(data, function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(result);
                db.close();
                callback(result);
            })
        })
    },
    GetFormid: function(formName, callback) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('form');
            var filter = {
                'formname': formName
            };
            collection.find(filter).toArray(function(err, doc) {
                console.log(doc);
                db.close();
                callback(doc[0]['_id']);
            });
        })
    },
    GetFormname: function(formid, callback) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('form');
            var filter = {
                'fileid': formid
            };
            console.log(formid);
            collection.find(filter).toArray(function(err, doc) {
                console.log(doc);
                db.close();
                callback(doc[0]['formname']);
            });
        })
    },
    GetForms: function(callback) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('form');
            collection.find().toArray(function(err, doc) {
                console.log(doc);
                db.close();
                callback(doc);
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
                db.close();
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
                'fileid': id
            }
            console.log(id);
            collection.find(filter).toArray(function(err, res) {
                console.log(res);
                db.close();
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
            var collection = db.collection('userInfo');
            var filter = {
                'userid': user.id,
                'password': crypto.createHash('sha256').update(CONFIG.PASSWORD_SALT + user.password).digest('hex')
            }
            collection.find(filter).toArray(function(err, res) {
                console.log(res);
                db.close();
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
                db.close();
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

            var oldPsw_cry = crypto.createHash('sha256').update(CONFIG.PASSWORD_SALT + oldPsw).digest('hex');
            var newPsw_cry = crypto.createHash('sha256').update(CONFIG.PASSWORD_SALT + newPsw).digest('hex');
            
            var collection = db.collection('userInfo');
            var filter = {
                'userid': userid,
                'password': oldPsw_cry
            }
            collection.update(filter, { $set: { 'password': newPsw_cry } }, function(err, res) {
                if (err) {
                    console.log(err);
                    return;
                }
                db.close();
                cb(res);
            })
        })
    },
    GetScholar: function(userid, cb) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('scholarshipInfo');
            collection.find({ userid: userid }).toArray(function(err, res) {
                console.log(res);
                db.close();
                cb(res);
            })
        });
    },
    InsertFile: function(fileName, filePath, fileid, cb) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('file');
            var fileid = ((new Date()).getTime()) + '';
            var file = {
                filename: fileName,
                fileid: fileid,
                filepath: filePath
            };
            collection.insert(file, function(err, res) {
                console.log(res);
                db.close();
                callback(res, fileid);
            });
        });
    },
    CreateScholarInfo: function(fileid, userid, cb) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('scholarshipInfo');
            var data = {
                fileid: fileid,
                userid: userid
            };
            collection.insert(data, function(err, res) {
                console.log(res);
                db.close();
                callback(res);
            });
        });
    },
    GetFile: function(fileid, cb) {
        MongoClient.connect(db_con, function(err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var collection = db.collection('file');
            collection.find({ fileid: fileid }).toArray(function(err, res) {
                console.log(res);
                db.close();
                cb(res[0]['filepath']);
            })
        });
    }
}