var multer = require("multer");

var storage = multer.diskStorage({
    destination: "public/data/"
})

var upload = multer({
    storage: storage
})

module.exports = upload;