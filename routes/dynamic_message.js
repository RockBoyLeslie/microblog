var pool = require('../db/dbconnection').pool;

// send message
exports.sendBlog = function(req, res) {
    var from_user = req.session.user.id;
    var to_user = req.body['to_user'];
    var parent_id = req.body['parent_id'] ;
    if (!parent_id) {
        parent_id = 0;
    }
    var title = req.body['title'];
    var content = req.body['content'];
    if (!title || !content) {
        res.send("私信标题和内容不能为空");
    }

    pool.getConnection(function(err, connection) {
        try {
            connection.query(
                'insert into microblog.private_messages(from_user, to_user, title, content, parent_id) values (?,?,?,?,?)',
                [from_user,to_user,title,content,parent_id],
                function(err, rows) {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/outbox');
                });
        } catch (err) {
            res.send(err);
        } finally {
            connection.end();
        }
    })
};

// show private message
exports.show = function(req, res) {
    var id = req.query.id;
    pool.getConnection(function(err, connection) {
        try {
            connection.query(
                'select m.id, m.to_user, m.from_user,m.is_read, m.title, m.content,m.created_at, u.name from microblog.private_messages m, microblog.user_accounts u ' +
                    "where m.id = ? and u.id = m.to_user",
                [id],
                function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    if (rows[0]) {
                        var message = rows[0];
                        if (req.session.user.id == message.to_user && message.is_read == '0') {
                            connection.query("update microblog.private_messages set is_read = '1' where id = ?", [id], function(err, rows){
                                if (err) {
                                    throw err;
                                }
                                res.render("messages/show", {title : "查看私信", message : message});
                            });
                        }
                        res.render("messages/show", {title : "查看私信", message : message});
                    } else {
                        res.send("无效的私信ID");
                    }
                });
        } catch (err) {
            res.send(err);
        } finally {
            connection.end();
        }
    })
};
