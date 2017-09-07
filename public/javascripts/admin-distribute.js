$('.examiner-checkbox input').each(function() {
    var self = $(this),
        label = self.next(),
        label_text = label.text();

    label.remove();
    self.iCheck({
        checkboxClass: 'icheckbox_line-blue',
        radioClass: 'iradio_line-blue',
        insert: '<div class="icheck_line-icon"></div>' + label_text
    });
});
$('.examinee-checkbox input').each(function() {
    var self = $(this),
        label = self.next(),
        label_text = label.text();

    label.remove();
    self.iCheck({
        checkboxClass: 'icheckbox_line-blue',
        radioClass: 'iradio_line-blue',
        insert: '<div class="icheck_line-icon"></div>' + label_text
    });
});
$('#dis-btn').click(function() {
    let examiner_id = [];
    let tmp_examiner = $('.examiner-checkbox input');
    for (let i = 0; i < tmp_examiner.length; i++) {
        if (tmp_examiner.eq(i).is(':checked'))
            examiner_id.push(tmp_examiner.eq(i).val());
    }
    let examinee_id = [];
    let tmp_examinee = $('.examinee-checkbox input');
    for (let i = 0; i < tmp_examinee.length; i++) {
        if (tmp_examinee.eq(i).is(':checked'))
            examinee_id.push(tmp_examinee.eq(i).val());
    }
    console.log(examinee_id);
    console.log(examiner_id);
    $.post('/admin/task/distribute', { examiners: examiner_id.toString(), examinees: examinee_id.toString() }, function(res) {
        if (!res.success)
            alert(res.error);
        // window.location.href = "/admin/task/detail";

    })
});