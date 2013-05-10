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
    $('#user_hover').hover(function(){
        $.ajax({
            url: '/fetchRequests',
            type: 'get',
            dataType: 'json',
            success: function(data) {
                if (data.response_code == 0) {
                    for(var i= 0,req_length=data.requests.length;i<req_length;i++){
                        if(i<5){
                            var inviterItem = data.requests[i].name
                            var pendingMsg = '<dl><span><a href="#">' + inviterItem +
                                '</a>&nbsp;请求加您好友</span><button id="accept_friends" class="formbtn_l">同意</button>' +
                                '<button id="reject_friends" class="formbtn_l">拒绝</button></dl>';
                            $("#user_line dt").append(pendingMsg);
                        }
                    }
                    if(req_length>=5){
                        $("#user_line dt").append('<dl><span><a href="#" class="more">查看更多消息...</a></span></dl>');
                    }
                }
            }
        });
        if($(this).siblings().children('.hide')){
            $(this).siblings().children('.hide').hide();
        }
        $('#user_line').show();
    },function(){
        selectLeave("#user_line");
    });

    $('#msg_hover').hover(function(){
        $.ajax({
            url: '',
            type: 'get',
            dataType: 'json',
            success: function(data) {
                $("#msg_line dt").append('<dl class="comments_list"><span><a href="#">xxxx</a>&nbsp; 新信息</span><button id="seecmt" class="formbtn_l">查看</button></dl>');
            }
        });
        delSiblings("#msg_hover");
        $('#msg_line').show();
    },function(){
        selectLeave("#msg_line");
    });
    $('#set_hover').hover(function(){
            delSiblings(this);
        }
    );
    function delSiblings(s){
        if($(s).siblings().children('.hide')){
            $(s).siblings().children('.hide').hide();
        }
    }
    function selectLeave(hover){
        $(hover).hover(function(){
            $(this).addClass("active");
        },function(){
            $(this).removeClass("active").hide();
            $(hover+" dt").html('');
        });
        if(!$(hover).hasClass("active")){
            $(hover).hide();
            $(hover+" dt").html('');
        }else{
            $(hover).removeClass("active");
        }
    }
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



