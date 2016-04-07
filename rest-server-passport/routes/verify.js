// Use token-based verification together with the Passport module to verify
// the authenticity of users and control access to routes.

var User = require('../models/user');
// used to create, sign, and verify tokens
var jwt = require('jsonwebtoken');
var config = require('../config');

exports.getToken = function(user) {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 3600   // make token valid for 3600 seconds
  });
};

exports.verifyOrdinaryUser = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token)  {
    // verifies secret and checks exp
    jwt.verify(token, config.secretKey, function(err, decoded)  {
      if (err)  {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token, return error
    var err = new Error('No token provided!');
    err.status = 401;
    return next(err);
  }
};

// Verify if a user is admin, should follow verifyOrdinaryUser() in the middleware order in Express
exports.verifyAdmin = function(req, res, next) {
  if (req.decoded._doc.admin) {
    return next();
  } else {
    var err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
  }
};
