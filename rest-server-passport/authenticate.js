var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var config = require('./config');

var FacebookStrategy = require('passport-facebook').Strategy;

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.facebook = passport.use(new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done)  {
    User.findOne({OauthID: profile.id, provider: profile.provider}, function(err, user) {
      if (err) {
        // console.log(err);   // handle errors
        return done(err);
      }
      if (!err && user !== null)  {
        console.log("User in database");
        done(null, user);
      }
      else {
        user = new User({
          username: profile.displayName
        });
        user.OauthID = profile.id;
        user.OauthToken = accessToken;
        user.provider = profile.provider;
        user.save(function(err) {
          if (err)  {
            console.log(err);   // handel errors
          }
          else {
            console.log("Saving user ...");
            done(null, user);
          }
        });
      }
    });
  }
));
