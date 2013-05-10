/**
 * Created with JetBrains WebStorm.
 * User: Sophia
 * Date: 5/9/13
 * Time: 10:47 AM
 * To change this template use File | Settings | File Templates.
 */

$(function(){
    //请求添加好友
    $("button[name='requestFriend']").click(function(){
        var id = $(this).attr("for");
        $.ajax({
            url : "/requestFriend",
            type : "post",
            data : "invitee=" + id,
            dataType : 'json',
            success : function(data) {
                if (data.response_code == 0) {
                    alert(data.response_message);
                } else {
                    alert("好友请求发送失败， 请稍后再试");
                }
            }
        });
    });
});



