;
$("#excel").fileinput({
    allowedFileExtensions: ["zip"],
    uploadUrl: '/admin/formupload',
    uploadAsync: true
});