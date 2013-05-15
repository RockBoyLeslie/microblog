/**
 * Created with JetBrains WebStorm.
 * User: Sophia
 * Date: 13-5-7
 * Time: 下午4:55
 * To change this template use File | Settings | File Templates.
 */
$(function(){
    $('.formblock input,textarea').attr({
        'onblur':"this.className="+"'inputblur'",
        'onfocus':"this.className="+"'inputfocus'"
    });


    //登录验证
    $('#loginbtn').click(function(){
        var username = $("#username").val();
        if(username.length==0){

        }
    });

});
