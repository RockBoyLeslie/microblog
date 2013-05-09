var pool = require('../db/dbconnection').pool;

// send friend request
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

// query the friend requests and notifications for current user
exports.notification = function(req, res) {
    var current_user = req.session.user.id;

    pool.getConnection(function(err, connection){
        var data = {response_code : '0'};
        try {
            // fetch friend requests
            connection.query("select count(1) as friend_requests from microblog.user_requests where invitee = ? and type = 'friend' and status = 'pending'", [current_user], function(err, rows, fields){
                if (err) {
                    throw err;
                }
                data.friend_requests = rows[0].friend_requests;
            });
            res.json(data);
        } catch (err) {
            res.send(err);
        } finally {
            connection.end();
        }
    });
}
