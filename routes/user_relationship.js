var pool = require('../db/dbconnection').pool;

// fetch all friends for current user
exports.fetchFriends = function(req, res) {
    var current_user = req.session.user.id;
    pool.getConnection(function(err, connection) {
        try{
            connection.query(
                "select r.friend_id, u.name, u.email from microblog.user_relationships r,microblog.user_accounts u" +
                " where r.user_id = ? and r.type = 'friend' and u.id = r.friend_id order by u.name",
                [current_user],
                function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    res.render('friends/list', {title : '我的好友', friends : rows});
                }
            )
        } catch(err) {
            res.send(err);
        } finally {
            connection.end();
        }
    });
};


