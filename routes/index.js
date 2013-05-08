/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', {title:'登录'});
};

exports.login = function(req,res){
    res.render('login', {title:'登录'});
};

exports.register = function(req,res){
    res.render('register',{title:'注册'});
};