var multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var tmp = file.originalname.split('.');
        var type = tmp[tmp.length - 1];
        console.log(type);
        if (type == 'xls' || type == 'xlsx')
            cb(null, "public/data/excels");
        else
            cb(null, "public/scholar/zips");
    },
    filename: function(req, file, cb) {
        var tmp = file.originalname.split('.');
        var type = tmp[tmp.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + type);
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1000000,
    },
    fileFilter: function(req, file, cb) {
        var tmp = file.originalname.split('.');
        var type = tmp[tmp.length - 1];
        console.log(file.fieldname);
        if (file.fieldname == "excel") {
            if (type == 'xls' || type == 'xlsx')
                cb(null, true);
            else
                cb(null, false);
        } else if (file.fieldname == 'zip') {
            if (type == 'zip') {
                console.log('pass');
                cb(null, true);
            } else
                cb(null, false);
        }
    }
});

module.exports = upload;