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
