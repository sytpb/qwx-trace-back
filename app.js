const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const traceRouter = require('./routes/trace');
const stateRouter = require('./routes/state');

const app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, '/public/build')));

app.use('/onetown/traceback',traceRouter);
app.use('/onetown/stateback',stateRouter);


//app.get('/*', function (req, res) {
//    res.sendFile(path.join(__dirname, '/public/build', 'index.html'));
//});


//console.log(process.env.PORT);
console.log(path.join(__dirname, 'public'));
app.use(function(req, res, next) {
  next(createError(404));
});

/*error handler*/
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
