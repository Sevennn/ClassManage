var express = require('express');
var router = express.Router();
var database = require("../models/database");
var xlReader = require("../models/excelHandler");
var session = require("express-session");

router.get('/', function(req, res, next) {
    if (req.session.userid)
        delete req.session.userid;
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
    database.getForms(function(arr) {
        var success = false;
        if (req.session.success == true)
            success = true;
        delete req.session.success;
        res.render('mainpage', { arr: arr, success: success });
    })
});
router.get('/submitform', function(req, res, next) {
    database.getFormname(req.query.formid, function(name) {
        xlReader.MakeJade(name, function(data) {
            res.render('submit', { keys: data, formId: req.query.formid, formName: name });
        });
    })
})
router.post('/submitform', function(req, res, next) {
    var data = req.body;
    console.log(data);
    data.formid = req.query.formid;
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
module.exports = router;