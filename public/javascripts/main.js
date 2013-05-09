/**
 * Created with JetBrains WebStorm.
 * User: Sophia
 * Date: 13-5-7
 * Time: 下午4:55
 * To change this template use File | Settings | File Templates.
 */
$(function(){
    $('.formblock input').attr({
        'onblur':"this.className="+"'inputblur'",
        'onfocus':"this.className="+"'inputfocus'"
    });
    $('#user_hover').hover(function(){
       $.ajax({
           url: '/fetchRequests',
           type: 'get',
           dataType: 'json',
           success: function(data) {
               if (data.response_code == 0) {
                   for(var i= 0,req_length=data.requests.length;i<req_length;i++){
                       var inviterItem = data.requests[i].name
                       var pendingMsg = '<dl><span><a href="#">' + inviterItem +
                       '</a>&nbsp;请求加您好友</span>' +
                       '<button id="accept_friends" class="formbtn_l">同意</button>' +
                       '<button id="reject_friends" class="formbtn_l">拒绝</button></dl>';
                       $("#user_line dt").append(pendingMsg);
                   }
               }
           }
       });
       $('#user_line').removeClass("hide");
    },function(){
       $("#user_line").hover(function(){
       },function(){
           $('#user_line').addClass("hide");
       });
    });

    $('#msg_hover').hover(function(){
        $.ajax({
            url: '',
            type: 'get',
            dataType: 'json',
            success: function(data) {
                if (data.response_code == 0) {

                }
            }
        });
        $('#msg_line').removeClass("hide");
    },function(){
        $("#msg_line").hover(function(){
        },function(){
            $('#msg_line').addClass("hide");
        });
    });


    //登录验证
    $('#loginbtn').click(function(){
        var username = $("#username").val();
        if(username.length==0){

        }
    });

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
