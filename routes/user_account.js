var pool = require('../db/dbconnection').pool;
exports.register = function(req, res) {
    var email = req.body['email'];
    var username = req.body['username'];
    var password = req.body['password'];
    var data = {
        title : '注册',
        email : email,
        username : username
    }
    if(req.body['password'] != req.body['passwordRe']) {
        data.response_message = '两次输入密码不相同';
        res.render('register',data);
    }

    pool.getConnection(function(err, connection) {
        connection.query('select 1 from microblog.user_accounts where email = ?', [email], function(err, rows, fields){
            if (err) {
                throw err;
            }
            if(rows[0]){
                data.response_message = '邮箱已经存在',
                res.render('register',data);
            }

            var values = [email, username, password];
            connection.query( 'insert into  microblog.user_accounts(email, name, password) values(?, ?, ?)', values, function(err, rows) {
                 if (err) {
                     throw err;
                 }else {
                     res.send('register succeed');
                 }
            });
            connection.end();
        });
    });
};

exports.login =  function(req, res) {
    var email = req.body['email'];
    var password = req.body['password'];
    var values = [email, password];
    pool.getConnection(function(err, connection){
        connection.query('select email, id , name from microblog.user_accounts where email = ? and password = ?', values, function(err,rows,fields){
            connection.end();
            if(!rows[0]){
                res.render('login', {title:'登录', response_message:'邮箱或密码错误', email:email});
            } else {
                req.session.user = rows[0];
                res.redirect('/home');
            }
        })
    })
};

exports.find = function(req, res) {
    var keyword = '%' + req.query.keyword + '%';
    var current_user = req.session.user.id;
    pool.getConnection(function(err, connection) {
        connection.query(
            'select u.*, r.type from (select id , name, email from microblog.user_accounts  where (email like ? or name like ?) and id != ?) u ' +
                'left join (select friend_id, type from microblog.user_relationships where user_id = ?) r on u.id = r.friend_id;',
            [keyword, keyword, current_user, current_user],
            function(err, rows, fields) {
                if (err) {
                    throw err;
                }
                var data = {
                    title : '搜索结果',
                    users : rows
                };
                res.render('users/find', data);
            }
        )
    });
};

exports.logout = function(req, res) {
    req.session.user = null;
    res.redirect('/');
};