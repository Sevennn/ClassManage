;
(function() {
    $('.user-container').click(function() {
        var id = $(this).find('.user-id').html();
        console.log($('#SelectedItem'));
        $('#SelectedItem').attr('href', id);
    });
    // $('#delete-btn').click(function() {
    //     let Url = '/admin/delete';
    //     $.post(Url,$('#SelectedItem').attr('href'), function(res) {
    //         $('#myDelete').modal({show : false});
    //         if (res['success']) {

    //         }
    //     })
    // })
    $('#modify-btn').click(function() {
        let Url = '/admin/modify?userid=' + $('#SelectedItem').attr('href');
        $.post(Url, { role: $('#select-role').val() }, function(res) {
            $('#myModify').modal({ show: false });
            if (res.success)
                location.reload();
            else
                alert('modify failed');
        })
    })
})();