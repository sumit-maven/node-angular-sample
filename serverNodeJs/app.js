var express = require('express');
var path = require('path');
var nodemailer = require('nodemailer');
var connect = require('connect');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboyBodyParser = require('busboy-body-parser');
var db = require('./model/db');
answers = require('./model/answers');
questions = require('./model/questions');
users = require('./model/users');
admin = require('./model/admin');
assessment = require('./model/assessment');
assessqueid = require('./model/assessqueid');
userassessments = require('./model/userassessments');
usersans = require('./model/usersans');
assessques = require('./model/assessques');
group = require('./model/group');
// feeds = require('./model/feeds');
category = require('./model/category');
articals = require('./model/articals');
userstoken = require('./model/userstoken');
terms = require('./model/terms');
privacy = require('./model/privacy');
chat = require('./model/chat');
feedback = require('./model/feedback');
notifications = require('./model/notifications');
instruction = require('./model/instruction');
// groupusers = require('./model/groupusers');
moderator = require('./model/moderator');
language = require('./model/language');
articals = require('./model/articals');
report = require('./model/report');
userreport = require('./model/userreport');


var baduga = require('./routes/baduga');
var users = require('./routes/users');
var group = require('./routes/group');
// var feeds = require('./routes/feeds');
var category = require('./routes/category');
var articals = require('./routes/articals');
var admin = require('./routes/admin');
var assessment = require('./routes/assessment');
var questions = require('./routes/questions');
var answers = require('./routes/answers');
var moderator = require('./routes/moderator');
var assessques = require('./routes/assessques');
var test = require('./routes/test');
var chat = require('./routes/chat');

var db = require('./model/db');
var app = express();


app.all('*', function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 res.header('Access-Control-Allow-Headers', 'Content-Type');
 next();
});

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(favicon(path.join(__dirname, 'public', 'index.html')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname ,'public')));
// app.use('/', routes);
app.use('/baduga', baduga);
app.use('/users', users);
app.use('/admin', admin);
app.use('/group', group);
// app.use('/feeds', feeds);
app.use('/articals', articals);
app.use('/questions', questions);
app.use('/assessment', assessment);
app.use('/answers', answers);
app.use('/moderator', moderator);
app.use('/assessques',assessques);
app.use('/category',category);
app.use('/test',test);
app.use('/chat',chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// app.use(fileUpload());
app.post('/upload', function(req, res) {
  var fileUpload = require('express-fileupload');
  var sampleFile;
  if (!req.files) {
    res.send('No files were uploaded.');
    return;
  }
  sampleFile = req.files.sampleFile;
  sampleFile.mv('/uploads/filename.jpg', function(err) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.send('File uploaded!');
    }
  });
});



module.exports = app;
