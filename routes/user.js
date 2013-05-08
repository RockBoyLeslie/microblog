var pool = require('../db/dbconnection').pool;

exports.register = function(req,res){
    var email = req.body['email'];
    var username = req.body['username'];
    var password = req.body['password'];
    var values = [email, username, password];
	console.log(values);
    pool.getConnection(function(err, connection) {
        connection.query('select 1 from microblog.user_accounts where email = ?', [email], function(err, rows, fields){
            if (err) {
                throw err;
            }
            if(rows[0]){
                res.send('email already exists');
            }else{
                if(req.body['password']!=req.body['passwordRe']){
                    res.send('different passwords inputed');
                }else{
                    connection.query( 'insert into  microblog.user_accounts(email, name, password) values(?, ?, ?)', values, function(err, rows) {
                        if (err) {
                            res.send(err);
                        }else {
                            res.send('register succeed');
                        }
                    });
                }
            }
            connection.end();
        });
    });
};

exports.login =  function(req,res){
    var email = req.body['email'];
    var password = req.body['password'];
    var values = [email, password];
    pool.getConnection(function(err,connection){
        connection.query('select 1 from microblog.user_accounts where email = ? and password = ?', values, function(err,rows,fields){
            connection.end();
            if(!rows[0]){
                res.send('email or password is wrong');
            } else {
                res.send('login succeed');
            }
        })
    })
};
