/**
 * Created with JetBrains WebStorm.
 * User: Sophia
 * Date: 5/9/13
 * Time: 10:47 AM
 * To change this template use File | Settings | File Templates.
 */

$(function(){
    fetch_dynamic_messages();

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
        if($(this).next().css('display')=='none'){
            $(this).nextAll().slideDown(500);
        }else{
            $(this).nextAll().slideUp(500);
        }
    })
});



