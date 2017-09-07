var express = require('express');
var router = express.Router();
var database = require("../models/database");
var xlReader = require("../models/excelHandler");
var session = require("express-session");
var file = require("../models/file");
var scholar = require("../models/scholar");
var upload = require('../models/uploads');
var user = require('../models/user');
router.get('/', function(req, res, next) {
    if (req.session.userid)
        res.redirect('/main');
    res.render('signin');
})
router.post('/signin', function(req, res, next) {
    user.UserLogin(req.body.id, req.body.password, function(err, user) {
        if (err)
            res.send(err);
        else {
            req.session.userid = user.userid;
            req.session.student_id = user.student_id;
            req.session.role = user.role;
            res.json({ success: true });
        }
    })
});

router.all('*', function(req, res, next) {
    console.log(req.session.userid);
    if (req.session.userid == undefined)
        res.redirect('/');
    else
        next();
});
/* GET home page. */
router.get('/main', function(req, res, next) {
    // database.insertForm('ex', function(res) { console.log(res) });
    // res.render('submitForm');
    file.GetFilesInfo("sheet_name != null", function(err, data) {
        if (err)
            res.send(err);
        else
            res.render('mainpage', { arr: data, role: req.session.role });
    });
});
router.get('/submitform', function(req, res, next) {
    file.GetFileInfo(req.query.fileid, function(err, info) {
        if (err)
            res.send(err);
        else
            xlReader.MakeJade(info.file_path, function(data) {
                res.render('submit', { keys: data, fileid: req.query.fileid, sheet_name: info.sheet_name });
            })
    });
})
router.post('/submitform', function(req, res, next) {
    var data = req.body;
    console.log(data);
    data.formid = req.query.fileid;
    data.userid = req.session.userid;
    database.InsertUserData(data, function(result) {
        req.session.success = true;
        res.redirect('/main');
    })
});
router.get('/userinfo', function(req, res, next) {
    res.render('usersetting');
});

router.post('/checkpsw', function(req, res, next) {
    database.UserLogin({ id: req.session.userid, password: req.body.password }, function(re) {
        console.log(re);
        if (re.length > 0) {
            res.send("pass");
        } else
            res.send("fail");
    });
});

router.post('/updatepsw', function(req, res, next) {
    database.UpdatePsw(req.session.userid, req.body.oldpassword, req.body.password, function(result) {
        console.log(result);
        delete req.session.userid;
        res.redirect('/');
    })
})

router.get('/scholar/page', function(req, res, next) {
    scholar.GetScholarInfo(req.session.userid, function(err, data) {
        console.log(data);
        scholar.GetScholarFileId(req.session.userid, function(err, data) {
            res.render('scholar', { info: data[0], comment: false, fileid: data.length > 0 ? data[0].file_id : undefined });
        })
    })
});
router.get('/scholar/upload', function(req, res, next) {
    res.render('upload', { type: 'zip', excel: false });
})

router.post('/scholar/upload/zip', upload.single('zip'), function(req, res, next) {
    console.log(req.file);
    if (req.file) {
        var filename = req.file.originalname;
        console.log(filename);
        file.CreateFile(req.file.destination + '/' + req.file.filename, function(err, fileid) {
            scholar.CreateScholarInfo(req.session.userid, fileid, function(err, result) {
                if (err)
                    res.json({ error: err });
                else {
                    res.json({ error: '' });
                }
            })
        });
    } else {
        // req.session.file.success = false;
        console.log('upload failed');
        res.json({
            error: 'file upload failed, check your file type or size',
            initialPreview: [],
            initialPreviewConfig: [],
            initialPreviewThumbTags: []
        });
    }
})


router.get('/scholar-getfile', function(req, res, next) {
    file.DownloadFile(req.query.fileid, function(err, filepath) {
        if (err)
            res.send(err);
        else
            res.redirect(filepath.substr(filepath.indexOf('scholar')));
    });
});
module.exports = router;