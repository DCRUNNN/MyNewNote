var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

var routes = require('./routes/index');
var login = require('./routes/login');
var signUp = require('./routes/signUp');
var notebook = require('./routes/notebook');
var tagManage = require('./routes/tagManage');
var userManage = require('./routes/userManage');
var friends = require('./routes/friends');
var sharedPage = require('./routes/sharedPage');
var myInfo = require('./routes/myInfo');
var recognition = require('./routes/aiSpeechRecognition');
var databaseHelper = require('./routes/database');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', login);
app.use('/index', routes);
app.use('/signUp', login);
app.use('/notebook', notebook);
app.use('/tagManage', tagManage);
app.use('/userManage', userManage);
app.use('/friends', friends);
app.use('/sharedPage', sharedPage);
app.use('/myInfo', myInfo);
app.use('/baiduAI2', recognition);

// app.use('home', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

let whitelist = ['http://localhost:3000', 'https://www.baidu.com/', 'https://openapi.baidu.com/oauth/2.0/token'];
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin
        if(!origin) return callback(null, true);
        if(whitelist.indexOf(origin) === -1){
            let message = 'The CORS policy for this origin doesn`t '
                + 'allow access from the particular origin.';
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

module.exports = app;
