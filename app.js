
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user_account = require('./routes/user_account')
  , user_request = require('./routes/user_request')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// index part
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/register', routes.register);

// user_account part
app.post('/register', user_account.register);
app.post('/login', user_account.login);
app.get('/find', user_account.find);

// user_request part
app.post('/requestFriend', user_request.requestFriend);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
