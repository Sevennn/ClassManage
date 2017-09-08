var express = require('express');
var router = express.Router();
var database = require("../models/database");
var xlReader = require("../models/excelHandler");
var upload = require("../models/uploads");
var file = require('../models/file');
var user = require('../models/user');
var scholar = require('../models/scholar');
var task = require('../models/task');
/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.adminid)
        res.redirect('/main');
    else
        res.render('adminLogin');
})
router.post('/signin', function(req, res, next) {
    database.AdminLogin(req.body, function(re) {
        if (re.length > 0) {
            req.session.adminid = req.body.id;
            res.json({ 'success': true });
        } else
            res.json({ 'error': 'no such user!' });
    });
});
router.all('/*', function(req, res, next) {
    if (!req.session.adminid)
        res.redirect('/admin');
    else
        next();
})
router.get('/main', function(req, res, next) {
    // if (!req.session.adminid)
    //     res.redirect('/admin');
    // else
    // file.GetFilesInfo("sheet_name != null", function(err, data) {
    //     if (err)
    //         res.send(err);
    //     else
    //         res.render('Adminpage', { arr: arr });
    // });
    res.render('AdminPage');
})
router.get('/formupload', function(req, res, next) {
    // if (!req.session.adminid)
    //     res.redirect('/admin');
    // else
    res.render('upload', { type: "excel", excel: true });
})
router.post('/formupload', upload.single('excel'), function(req, res, next) {
    console.log(req.file);
    if (req.file) {
        var formname = req.file.originalname;
        console.log(formname);
        file.CreateForm(req.file.destination, req.file.originalname, function(err) {
            if (err)
                res.json({ error: err });
            else
                res.json({ error: '' });
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
});

router.get('/manage', function(req, res, next) {
    user.UserSearch({ class: 5 }, function(err, members) {
        res.render('AdminManage', { members: members });
    })
});
router.post('/modify', function(req, res, next) {
    console.log("data", req.body.userid, req.body.role);
    user.UserUpdate({ student_id: req.body.userid }, { role: req.body.role }, function(err, result) {
        if (err)
            res.send(err);
        else
            res.json({ success: true });
    })
});
router.get('/distribute', function(req, res, next) {
    var examinee = [],
        examiner = [];
    scholar.GetExaminee(function(err, result1) {
        if (err)
            res.send(err);
        else {
            examinee = result1;
            scholar.GetExaminer(function(err, result2) {
                if (err)
                    res.send(err);
                else {
                    examiner = result2;
                    console.log(examinee, examiner);
                    res.render('DistributePage', { examinee: examinee, examiner: examiner });
                }
            })
        }
    })
});
router.post('/task/distribute', function(req, res, next) {
    console.log(req.body.examiners.split(','), req.body.examinees.split(','));
    task.DistributeTask(req.body.examiners.split(','), req.body.examinees.split(','), function(err, result) {
        console.log(err);
        if (err)
            res.send(err);
        else
            res.send({ success: true });
    });
});
router.get('/task/detail', function(req, res, next) {
        scholar.GetAllInfo(function(err, rows) {
            if (err)
                res.send(err);
            else
                res.render('task-detail', { list: rows });
        });
    })
    // wait for rewrite
    // router.get('/downloadform', function(req, res, next) {
    //     // if (!req.session.adminid)
    //     //     res.redirect('/admin');
    //     // else
    //     database.GetExcelFile(req.query.formid, function(filename) {
    //         res.redirect('/data/' + filename);
    //     });
    // })
module.exports = router;