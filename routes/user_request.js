var pool = require('../db/dbconnection').pool;

exports.requestFriend = function(req, res) {
    var invitee = req.body['invitee'];
    var current_user = req.session.user.id;
    pool.getConnection(function(err, connection) {
        try{
            connection.query(
                "select status from microblog.user_requests where inviter = ? and invitee = ? and type = 'friend'", [current_user, invitee],function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    if (rows[0]) {
                        var user_request =  rows[0];
                        if (user_request.status == 'approved') {
                            res.json({response_code : '0', response_message : '你俩已经是好友了'});
                        }
                        if (user_request.status == 'pending') {
                            res.json({response_code : '0', response_message : '好友请求发送成功'});
                        }
                    }

                    connection.query('insert into microblog.user_requests(inviter, invitee) values (?,?)', [current_user, invitee], function(err, rows) {
                        if (err) {
                            throw err;
                        }
                        res.json({response_code : '0', response_message : '好友请求发送成功'});
                    });
                }
            )
        } catch(err) {
            res.send(err);
        } finally {
            connection.end();
        }
    });
};
