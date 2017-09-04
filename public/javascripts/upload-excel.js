;
$("#excel").fileinput({
    allowedFileExtensions: ["xls", "xlsx"],
    uploadUrl: '/admin/formupload',
    uploadAsync: true
});