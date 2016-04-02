// Server with basic authentication
var express = require('express');
// Middleware
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

// Basic authentication function
function auth(req, res, next) {
  console.log(req.headers);
  var authHeader = req.headers.authorization;
  if (!authHeader)  {
    var err = new Error("You are not authenticated!");
    err.status = 401;
    next(err);
    return;
  }

  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  if (user == "user" && pass == "password") {
    next(); // authorized
  }
  else {
    var err = new Error("You are not authenticated!");
    err.status = 401;
    next(err);
  }
}

app.use(auth);

// Catch error
app.use(function(err, req, res, next) {
  res.writeHead(err.status || 500, {
    'WWW-Authenticate': 'Basic',
    'Content-Type': 'text/plain'
  });
  res.end(err.message);
});

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});
