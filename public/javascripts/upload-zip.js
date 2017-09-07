;

$("#zip").fileinput({
    allowedFileExtensions: ["zip"],
    enctype: "multipart/form-data",
    uploadUrl: '/scholar/upload/zip',
    uploadAsync: true
});