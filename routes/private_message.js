var pool = require('../db/dbconnection').pool;

// forward to 'send message' page
exports.toSendMessage = function(req, res) {
    var to_user = req.query.to_user;
    var parent_id = req.query.parent_id ;
    if (!parent_id) {
        parent_id = 0;
    }
    if (to_user) {
        pool.getConnection(function(err, connection) {
            try {
                connection.query('select id, name, email from microblog.user_accounts where id = ?', [to_user], function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    if (rows[0]) {
                        res.render("messages/send", {title : '发送私信', parent_id : parent_id,  to_user : rows[0]});
                    } else {
                        res.send("无效的收信人");
                    }
                });
            } catch (err) {
                res.send(err);
            } finally {
                connection.end();
            }
        })
    } else {
        res.send("收信人不能为空");
    }
};

// send message
exports.sendMessage = function(req, res) {
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

// list messages sent
exports.outbox = function(req, res) {
    var from_user = req.session.user.id;
    pool.getConnection(function(err, connection) {
        try {
            connection.query(
                'select m.id, m.to_user, m.title, u.name from microblog.private_messages m, microblog.user_accounts u ' +
                "where m.from_user = ? and m.status in ('0','2') and u.id = m.to_user order by m.created_at desc",
                [from_user],
                function(err, rows) {
                    if (err) {
                        throw err;
                    }
                    var data = {
                        title : '发信箱',
                        messages : rows
                    };
                    res.render("messages/outbox", data);
                });
        } catch (err) {
            res.send(err);
        } finally {
            connection.end();
        }
    })
};

// list messages recieved
exports.inbox = function(req, res) {
    var to_user = req.session.user.id;
    pool.getConnection(function(err, connection) {
        try {
            connection.query(
                'select m.id, m.from_user, m.title,m.is_read, u.name from microblog.private_messages m, microblog.user_accounts u ' +
                    "where m.to_user = ? and m.status in ('0','1') and u.id = m.from_user order by m.is_read, m.created_at desc",
                [to_user],
                function(err, rows) {
                    if (err) {
                        throw err;
                    }
                    var data = {
                        title : '收信箱',
                        messages : rows
                    };
                    res.render("messages/inbox", data);
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
