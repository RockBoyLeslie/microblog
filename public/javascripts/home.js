/**
 * Created with JetBrains WebStorm.
 * User: Sophia
 * Date: 5/9/13
 * Time: 10:47 AM
 * To change this template use File | Settings | File Templates.
 */

$(function(){
    fetch_dynamic_messages();
    fetch_friend_suggest();

    function fetch_dynamic_messages () {
        $.ajax({
            url : '/listBlog',
            method : 'get',
            dataType : 'json',
            success : function(data) {
                if (data.response_code == 0) {
                    $("#blog_ul").prepend(data.html);
                } else {
                    alert(data.response_message)
                }
            }
        });
    }

    function fetch_friend_suggest () {
        $.ajax({
            url : '/suggest',
            method : 'get',
            dataType : 'json',
            success : function(data) {
                if (data.response_code == 0) {
                    $("#friend_ul").prepend(data.html);
                } else {
                    alert(data.response_message)
                }
            }
        });
    }

    //发表微博
    $("#button_blog").click(function(){
        var content = $("#textarea_blog").val();
        $.ajax({
            url : '/sendBlog',
            data : 'content=' + content,
            method : 'post',
            dataType : 'json',
            success : function(data) {
                if (data.response_code == 0) {
                    $("#blog_ul").prepend(data.html);
                } else {
                    alert(data.response_message)
                }
            }
        });
    });
    $(document).on('click','.write',function(){
        var message_id = $(this).attr('for');
        if($(this).next().css('display')=='none'){
            $(this).nextAll().slideDown(500);
            $.ajax({
                url : '/listComment',
                data : 'message_id=' + message_id,
                method : 'get',
                dataType : 'json',
                success : function(data) {
                    if (data.response_code == 0) {
                        $("#comment_dt_"+message_id).prepend(data.html);
                    } else {
                        alert(data.response_message)
                    }
                }
            });
        }else{
            $(this).nextAll().slideUp(500);
            $("#comment_dt_"+message_id).html('');
        }
    });

    $(document).on('click',"button[name='sendComment']", function(){
        var message_id =  $(this).attr('for');
        var content = $("#textarea_comment_" + message_id).val();
        $.ajax({
            url : '/sendComment',
            data : 'content=' + content + '&message_id=' + message_id,
            method : 'post',
            dataType : 'json',
            success : function(data) {
                if (data.response_code == 0) {
                    $("#comment_dt_"+message_id).prepend(data.html);
                    $("#textarea_comment_" + message_id).val('');
                } else {
                    alert(data.response_message)
                }
            }
        });
    });

    //请求添加好友
    $(document).on('click',"button[name='requestFriend']", function(){
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



