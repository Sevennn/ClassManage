var express = require('express');
var router = express.Router();
var database = require("../models/database");
var xlReader = require("../models/excelHandler");
var upload = require("../models/uploads");
var file = require('../models/file');
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
    file.GetFilesInfo("sheet_name != null", function(err, data) {
        if (err)
            res.send(err);
        else
            res.render('Adminpage', { arr: arr });
    });
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
    
});
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