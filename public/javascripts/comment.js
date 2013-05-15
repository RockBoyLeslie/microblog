/**
 * Created with JetBrains WebStorm.
 * User: Sophia
 * Date: 13-5-15
 * Time: 下午7:36
 * To change this template use File | Settings | File Templates.
 */
$('.write').click(function(){
    if($(this).next().css('display')=='none'){
        $(this).nextAll().show();
    }else{
        $(this).nextAll().hide();
    }
});