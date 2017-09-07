;
$("#excel").fileinput({
    allowedFileExtensions: ["xls", "xlsx"],
    uploadUrl: '/admin/upload/excel;',
    uploadAsync: true
});