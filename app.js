
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user_account = require('./routes/user_account')
  , user_request = require('./routes/user_request')
  , user_relationship = require('./routes/user_relationship')
  , private_message = require('./routes/private_message')
  , dynamic_message = require('./routes/dynamic_message')
  , http = require('http')
  , path = require('path')
  , cookieStore = require('connect/lib/middleware/session/memory')
  , flash = require('connect-flash');

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());

// express session
app.use(express.session({
    secret:"leslie&sophia",
    store: new cookieStore
}));
app.use(express.methodOverride());

// app.dynamicHelpers
app.use(function(req, res, next){
    res.locals.csrf = req.session ? req.session._csrf : '';
    res.locals.req = req;
    res.locals.session = req.session;
    next();
});
app.use(app.router);
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// index part
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/register', routes.register);
app.get('/home', routes.home);
app.get('/notification', user_request.notification);


// user_account part
app.post('/register', user_account.register);
app.post('/login', user_account.login);
app.get('/logout', user_account.logout);
app.get('/find', user_account.find);
app.get('/suggest', user_account.suggest);


// user request part
app.post('/requestFriend', user_request.requestFriend);
app.get('/fetchRequests', user_request.fetchRequests);
app.get('/fetchMessages', user_request.fetchMessages);
app.get('/reject', user_request.reject);
app.get('/accept', user_request.accept);

// user relationship part
app.get('/friends', user_relationship.fetchFriends);

// user private message part
app.get('/sendMessage', private_message.toSendMessage);
app.post('/sendMessage', private_message.sendMessage);
app.get('/outbox', private_message.outbox);
app.get('/inbox', private_message.inbox);
app.get('/showMessage', private_message.show);

//user dynamic_message part
app.post('/sendBlog', dynamic_message.sendBlog);
app.post('/sendComment', dynamic_message.sendComment);
app.get('/listBlog', dynamic_message.listBlog);
app.get('/listComment', dynamic_message.listComment);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
