// Config file containing secret key and mongodb url
module.exports = {
  'secretKey': '12345-67890-09876-54321',
  'mongoUrl': 'mongodb://localhost:27017/conFusion',
  'facebook': {
    clientID: 'YOUR FACEBOOK ID',
    clientSecret: 'YOUR FACEBOOK SECRET',
    callbackURL: 'https://localhost:3443/users/facebook/callback'
  }
}
