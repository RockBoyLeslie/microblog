/*
 * GET home page.
 */

exports.index = function(req, res){
    if(req.session.user){
        //已登录状态
        res.redirect('/home');
    }else{
        res.render('index', {title:'登录', response_message:null, email:''});
    }
};

exports.login = function(req, res) {
    res.render('login', {title:'登录', response_message:null, email:''});
};

exports.register = function(req, res) {
    res.render('register',{title:'注册', response_message:null, email:'', username:''});
};

exports.home = function(req, res) {
    res.render('home', {title : '首页'});
}