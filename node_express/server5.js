// Use Express Router to implement server that supports REST API
var express = require('express');
// Middleware
var morgan = require('morgan');
var bodyParser = require('body-parser');
// Routers
var dishRouter = require('./dishRouter');
var promoRouter = require('./promoRouter');
var leaderRouter = require('./leaderRouter');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leadership', leaderRouter);

// Error handling
app.use(function(req, res, next) {
  res.status(400);
  res.end('Error: Cannot ' + req.method + ' ' + req.url);
});

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});


var dishRouter = require('./dishRouter');
