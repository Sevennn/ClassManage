;
$('#point-btn').click(function() {
    var text = $('#comment').val().replace(/\n/g, "<br/>");
    var point = $('#point').val();
    if (text == "") {
        alert('请输入评论！');
        return;
    }
    if (point == "") {
        alert("请输入分数");
        return;
    }
    var str = window.location.search;
    $.post('/scholar/comment', { point: point, comment: text, userid: str.substr(str.indexOf('=') + 1) }, function(res) {
        if (res.success) {
            alert("评论成功！");
            location = location;
        } else {
            alert(res.error);
        }
    })
})