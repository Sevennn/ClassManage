var multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var tmp = file.originalname.split('.');
        var type = tmp[tmp.length - 1];
        if (type == 'xls' || type == 'xlsx')
            cb(null, "public/data/excels");
        else
            cb(null, "public/data/zips");
    },
    filename: function(req, file, cb) {
        var tmp = file.originalname.split('.');
        var type = tmp[tmp.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + type);
    }
})

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024,
    },
    fileFilter: function(req, file, cb) {
        console.log(file.fieldname);
        var tmp = file.originalname.split('.');
        var type = tmp[tmp.length - 1];
        if (file.fieldname == "excel") {
            if (type == 'xls' || type == 'xlsx')
                cb(null, true);
            else
                cb(null, false);
        }
    }
})

module.exports = upload;