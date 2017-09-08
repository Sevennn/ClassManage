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
        if (user) {
            req.session.userid = user.userid;
            req.session.student_id = user.student_id;
            req.session.role = user.role;
            req.session.username = user.username;
            res.json({ success: true });
        } else {
            res.send("login failed");
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
router.get('/logout', function(req, res, next) {
    req.session.destroy(() => {
        res.redirect('/');
    });
});
/* GET home page. */
router.get('/main', function(req, res, next) {
    // database.insertForm('ex', function(res) { console.log(res) });
    // res.render('submitForm');
    // file.GetFilesInfo("sheet_name != null", function(err, data) {
    //     if (err)
    //         res.send(err);
    //     else
    //         res.render('mainpage', { arr: data, role: req.session.role, username: req.session.username });
    // });
    scholar.GetAllInfo(function(err, data) {
        if (err)
            res.send(err);
        else
            res.render('mainpage', { arr: data, role: req.session.role, username: req.session.username });
    })
});
router.get('/scholar/exam', function(req, res, next) {
    if (req.session.role != 0)
        res.redirect('/');
    scholar.GetScholarTask(req.session.userid, function(err, rows) {
        if (err)
            res.send(err);
        else
            res.render('ScholarTask', { examinees: rows });
    });

})
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

    user.UserLogin(req.session.student_id, req.body.password, (err, rows) => {
        if (err || !user)
            res.send(err)
        else
            res.send("pass");
    })
});

router.post('/updatepsw', function(req, res, next) {
    user.UpdatePsw(req.session.student_id, req.body.oldpassword, req.body.password, (err, rows) => {
        if (err)
            res.send(err);
        else {
            req.session.destroy();
            res.redirect('/');
        }
    })
})
router.get('/scholar/judge', function(req, res, next) {
    if (!req.query)
        res.send('error: no query');
    scholar.GetScholarExamineeInfo(req.query.userid, (err, rows) => {
        console.log(rows);
        if (err)
            res.send(err);
        else
            res.render('ScholarJudge', { user: rows[0], comment: true, studentid: req.query.studentid });
    })
})
router.get('/scholar/page', function(req, res, next) {
    scholar.GetScholarInfo(req.session.userid, function(err, data) {
        console.log(data);
        scholar.GetScholarFileId(req.session.userid, function(err, data) {
            res.render('ScholarJudge', { user: data[0], studentid: req.session.student_id, comment: false, fileid: data.length > 0 ? data[0].file_id : undefined });
        })
    })
});

router.post('/scholar/comment', (req, res, next) => {
    scholar.UpdateComment(req.body.userid, req.body.point, req.body.comment, (err, row) => {
        if (err)
            res.json({ error: err });
        else
            res.json({ success: true });
    })
})
router.get('/scholar/upload', function(req, res, next) {
    res.render('upload', { type: 'zip', excel: false });
})

router.post('/scholar/upload/zip', upload.single('zip'), function(req, res, next) {
    console.log(req.file);
    if (req.file) {
        var filename = req.file.originalname;
        console.log(filename);
        scholar.GetScholarFileId(req.session.userid, (err, rows) => {
            console.log(rows.length);
            if (rows.length <= 0)
                file.CreateFile(req.file.destination + '/' + req.file.filename, function(err, fileid) {
                    scholar.CreateScholarInfo(req.session.userid, fileid, function(err, result) {
                        if (err)
                            res.json({ error: err });
                        else {
                            res.json({ error: '' });
                        }
                    })
                });
            else
                file.UpdateFile(rows[0].file_id, req.file.destination + '/' + req.file.filename, function(err, rows) {
                    if (err)
                        res.json({ error: err });
                    else
                        res.json({ error: '' });
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