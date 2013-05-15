var pool = require('../db/dbconnection').pool;
var fs = require('fs');
var mustache = require('mustache');

// send blog
exports.sendBlog = function(req, res) {
    var user_id = req.session.user.id;
    var content = req.body['content'];
    pool.getConnection(function(err, connection) {
        try {
            connection.query('insert into microblog.dynamic_messages(content, user_id) values (?,?)', [content,user_id], function(err, rows) {
                if (err) {
                    throw err;
                }
            });
            connection.query(
                'select m.content, m.id, m.created_at, m.user_id, u.name from microblog.dynamic_messages m, microblog.user_accounts u where m.id = last_insert_id() and u.id = m.user_id',
                [],
                function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    fs.readFile('views/blog/blog.html', function(err, template){
                        if (err) {
                            throw err;
                        }
                        var html = mustache.to_html(template.toString(), rows[0]);
                        res.json({response_code : 0, html : html});
                        return;
                    });
                }
            )
        } catch (err) {
            res.json({response_code : -1, response_message : err});
        } finally {
            connection.end();
        }
    })
};

// list blogs sent by friends and myself
exports.listBlog = function(req, res) {
    var current_user = req.session.user.id;
    pool.getConnection(function(err, connection) {
        try {
            connection.query(
                "select m.content, m.id, m.created_at, m.user_id, u.name from microblog.dynamic_messages m, microblog.user_accounts u where " +
                "(m.user_id = ? or m.user_id in (select friend_id from microblog.user_relationships where user_id = ? and type = 'friend'))  and u.id = m.user_id order by m.created_at desc",
                [current_user, current_user],
                function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    fs.readFile('views/blog/blog.html', function(err, template){
                        if (err) {
                            throw err;
                        }
                        var html = '';
                        for (var i = 0; i < rows.length; i ++) {
                            html += mustache.to_html(template.toString(), rows[i]);
                        }
                        res.json({response_code : 0, html : html});
                        return;
                    });
                }
            );
        } catch (err) {
            res.json({response_code : -1, response_message : err});
        } finally {
            connection.end();
        }
    })
}

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
