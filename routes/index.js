/*
 * GET home page.
 */
/*var flash = require('connect-flash');

app.configure(function(){
    app.use(flash());
});*/
exports.index = function(req, res){
    if(req.session.user && req.session.user!=''){
        //已登录状态
        /*req.flash('success','用户已登录');*/
        res.send('您已经登录，即将跳转到个人主页...');
    }else{
        res.render('index', {title:'登录', response_message:null, email:''});
    }
};

exports.login = function(req,res){
    res.render('login', {title:'登录', response_message:null, email:''});
};

exports.register = function(req,res){
    res.render('register',{title:'注册', response_message:null, email:'', username:''});
};