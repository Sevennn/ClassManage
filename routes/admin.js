var express = require('express');
var router = express.Router();
var database = require("../models/database");
var xlReader = require("../models/excelHandler");
var upload = require("../models/uploads");
/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.adminid)
        delete req.session.adminid;
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
    database.getForms(function(arr) {
        var success = false;
        if (req.session.success == true)
            success = true;
        delete req.session.success;
        res.render('Adminpage', { arr: arr, success: success });
    })
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
        database.InsertForm(formname, req.file.filename, function(re) {
            // req.session.file.success = true;
            console.log(re);
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
})
router.get('/downloadform', function(req, res, next) {
    // if (!req.session.adminid)
    //     res.redirect('/admin');
    // else
    database.GetExcelFile(req.query.formid, function(filename) {
        res.redirect('/data/' + filename);
    });
})
module.exports = router;