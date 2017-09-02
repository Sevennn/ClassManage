var multer = require("multer");

var storage = multer.diskStorage({
    filename: function(req, file, cb) {
        var fileFormat = file.originalname;
        cb(null, fileFormat);
    },
    destination: "public/data/modules"
})

var upload = multer({
    storage: storage
})

module.exports = upload;