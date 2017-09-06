var express = require('express');
var router = express.Router();
var database = require("../models/database");
var xlReader = require("../models/excelHandler");
var session = require("express-session");
var file = require("../models/file");
var scholar = require("../models/scholar");
router.get('/', function(req, res, next) {
    if (req.session.userid)
        res.redirect('/main');
    res.render('signin');
})
router.post('/signin', function(req, res, next) {
    database.UserLogin(req.body, function(re) {
        if (re.length > 0) {
            req.session.userid = req.body.id;
            res.json({ 'success': true });
        } else
            res.json({ 'error': 'no such user!' });
    });
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
            res.render('mainpage', { arr: data });
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

router.get('/scholarpage', function(req, res, next) {
    scholar.GetScholarInfo(req.session.userid, function(err, data) {
        console.log(data);
        res.render('scholar', { info: data[0], comment: false });
    })
});
router.get('/getfile', function(req, res, next) {
    file.DownloadFile(req.body.fileid, function(err, filepath) {
        if (err)
            res.send(err);
        else
            res.redirect(filepath);
    });
});
module.exports = router;