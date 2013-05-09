/**
 * Created with JetBrains WebStorm.
 * User: Sophia
 * Date: 5/9/13
 * Time: 10:47 AM
 * To change this template use File | Settings | File Templates.
 */

$(function(){
    fetch_notification_message();
    setInterval(fetch_notification_message,30*1000);

    function fetch_notification_message () {
        $.ajax({
             url: '/notification',
             type: 'get',
             dataType: 'json',
             success: function(data) {
                 if (data.response_code == 0) {
                     if(data.friend_requests>0){
                         if(data.friend_requests>9) $("#user+.bubble").css('padding-left','5px');
                        $('#user+.bubble').css('display','block').html(data.friend_requests);
                     }
                     if(data.friend_comments+data.friend_messages>0){
                         $('#msg+.bubble').css('display','block').html(data.friend_comments+data.friend_messages);
                     }
                      //alert("好友请求 : " + data.friend_requests + ", 用户评论 : " + data.friend_comments + ", 私信 : " + data.friend_messages);
                     //$("#requests_span").html(data.requests);
                     //$("#notifications_span").html(data.private_messages + data.dynamic_messages);
                 }
             }
        });
    }
});



