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
                            return;
                        }
                        if (user_request.status == 'pending') {
                            res.json({response_code : '0', response_message : '好友请求发送成功'});
                            return;
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

// query the friend request number and notification number for current user
exports.notification = function(req, res) {
    var current_user = req.session.user.id;
    pool.getConnection(function(err, connection){
        try {
            // fetch friend requests
            connection.query(
                "select a.friend_requests, b.friend_comments, c.friend_messages from (select count(1) as friend_requests from microblog.user_requests where invitee = ? and type = 'friend' and status = 'pending') a" +
                " inner join (select count(1) as friend_comments from microblog.comments where message_user_id = ? and is_read = '0' and status = 'approved') b" +
                " inner join (select count(1) as friend_messages from microblog.private_messages where to_user = ? and is_read = '0' and status in ('0','1')) c",
                [current_user, current_user, current_user],
                function(err, rows, fields){
                    if (err) {
                        throw err;
                    }
                    var data = {
                        response_code : '0',
                        friend_requests : rows[0].friend_requests,
                        friend_comments : rows[0].friend_comments,
                        friend_messages : rows[0].friend_messages
                    };
                    res.json(data);
                }
            );
        } catch (err) {
            console.log(err);
            res.send(err);
        } finally {
            connection.end();
        }
    });
};

// fetch friend requests for current user
exports.fetchRequests = function(req, res) {
    var current_user = req.session.user.id;
    pool.getConnection(function(err, connection){
        try{
            connection.query(
                "select r.id as request_id, u.id as inviter,u.name, u.email from microblog.user_requests r, microblog.user_accounts u where r.invitee = ? and type = 'friend' and status = 'pending' and r.inviter = u.id",
                [current_user],
                function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    var data = {
                        response_code : '0',
                        requests : rows
                    };
                    res.json(data);
                }
            );
        } catch (err) {
            res.send(err);
        } finally {
            connection.end();
        }
    });
};

// reject friend request for current_user
exports.reject = function(req, res) {
    var request_id = req.body['request_id'];
    var inviter = req.body['inviter'];
    var invitee = req.session.user.id;
    pool.getConnection(function(err, connection){
        try {
            connection.query("update user_requests set status = 'rejected' where id = ? and inviter = ? and invitee = ? and status = 'pending'", [request_id, inviter, invitee], function(err, rows){
                if (err) {
                    throw err;
                }
                res.json({response_code : '0'});
                return;
            });
        } catch(err) {
            res.json({response_code : '-1', response_message : err});
        } finally {
            connection.end();
        }
    });
};

// accept friend request for current user
exports.accept = function(req, res) {
    var request_id = req.body['request_id'];
    var inviter = req.body['inviter'];
    var invitee = req.session.user.id;
    pool.getConnection(function(err, connection){
        try {
            connection.query("update user_requests set status = 'approved' where id = ? and inviter = ? and invitee = ? and status = 'pending'", [request_id, inviter, invitee], function(err, rows){
                if (err) {
                    throw err;
                }
                connection.query("select 1 from user_relationships where (user_id = ? and friend_id = ?) or (user_id = ? or friend_id = ?)", [inviter, invitee, invitee, inviter], function(err, rows, fields){
                    if (err) {
                        throw err;
                    }
                    if (rows[0]) {
                        res.json({response_code : '0', response_message : '你俩已经是好友了'});
                        return;
                    } else {
                        connection.query("insert into user_relationships(user_id, friend_id) values (?,?),hge(?,?)", [inviter, invitee, invitee, inviter], function(err, rows){
                            if (err) {
                                throw err;
                            }
                            res.json({response_code : '0', response_message : '好友添加成功'});
                            return;
                        });
                    }
                });
            });
        } catch(err) {
            connection.back();
            res.json({response_code : '-1', response_message : err});
        } finally {
            connection.end();
        }
    });
};
