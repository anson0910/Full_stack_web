/* test/test_it.js*/

var request = require('supertest');
var assert = require('assert');
var mongoose = require('mongoose');

var app = require('../app');
var Promotions = require('../models/promotions');
var Dishes = require('../models/dishes');
var User = require('../models/user');
var Verify = require('../routes/verify');


var TIMEOUT = 8000;
var TEST_PORT = 3000;
var TEST_SEC_PORT = TEST_PORT+443;
var HOSTNAME = 'localhost';
var UNSEC_SERVER = `http://${HOSTNAME}:${TEST_PORT}`
var SEC_SERVER = `https://${HOSTNAME}:${TEST_SEC_PORT}`
var SERVER = UNSEC_SERVER; // Default to unsecure server for compatibility
                           // with previous weeks exercises.
                           // Will be updated as part of W4 - Ex2 if a server
                           // is listening on the secure port


/*
 *                           /!\ DANGER :
 *
 *                         INSECURE SETTING
 *
 * USE THAT ONLY FOR TESTING PURPOSES IN ORDER TO ACCEPT SELF SIGNED CERTIFICATES
 *
 * See http://stackoverflow.com/a/29397100/2363712 for a less insecure solution
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/* end of DANGER zone */

var STRICT_REST = true; // change that to false depending on https://www.coursera.org/learn/server-side-development/lecture/bKtMl/exercise-video-rest-api-with-express-mongodb-and-mongoose/discussions/x1AZIu9SEeWB0QpuSDkq-Q
var HTTP_OK = 200;
var HTTP_CREATED = (STRICT_REST) ? 201 : HTTP_OK;
var HTTP_FORBIDDEN = 403;
var HTTP_UNAUTHORIZED = (STRICT_REST) ? 401 : HTTP_FORBIDDEN; // See http://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
var HTTP_NOT_FOUND = 404;

/*
 * Data
 */
var dishes_fixture = require('./fixtures/fixtures_dishes');
var promotions_fixture = require('./fixtures/fixtures_promotions');
var users_fixture = require('./fixtures/fixtures_users');
var new_promotion = {
  "name" : "St Valentin Special",
  "image" : "images/pink.png",
  "label" : "Hot",
  "price" : 1490,
  "description" : "All pink dishes !",
};

/*
 * Utility
 */
function login(username, password, callback, timeout) {
  timeout = timeout || 200;
  request(SERVER)
    .post('/users/login')
    .send({username: username, password: password})
    .end(function(err, res) {
      if (err) {
        console.log(err);
        throw err;
      }
      // Ugly retry loop as, apparently, there might be delay before being able
      // to log in and after user creation ?!? <-- THIS IS WRONG !!
      if (res.error && (timeout < 2000)) {
        console.log("Retrying login " + username);
        // console.log(res.error);
        setTimeout(function() { login(username, password, callback, timeout+200); },timeout);
      }
      else {
        callback(res);
      }
    });
}

function rendezVous(max, callback) {
  var n = 0;
  return function() {
    /* equality here to ensure only one call to callback no matter
       how many joined the rendez-vous */
    if (++n == max) callback();
  }
}



/*
 * Week 4 -- Exercice 2 tests
 */
describe('Week 4 - exercice 2', function(){
  describe('Server', function() {
    it(`should be listening on ${UNSEC_SERVER}`, function(done) {
      request(UNSEC_SERVER)
        .get("")
        .end(done);
    });
    it(`should be listening on ${SEC_SERVER}`, function(done) {
      request(SEC_SERVER)
        .get("")
        .expect(200)
        .expect(function(res) {
          SERVER = SEC_SERVER; // switch to https for functional tests
        })
        .end(done);
    });
    it(`should redirect http requests to https`, function(done) {
      var resources = [
        "/",            // root
        "/index.html",  // static
        "/dishes",
        "/users",
        "/leaders",
        "/promotions",
        "/inexistant",  // inexistant ressource
      ];
      var rdv = rendezVous(resources.length, done);
      for(var resource of resources) {
        request(UNSEC_SERVER)
          .get(resource)
          .expect(302)
          .expect('location', SEC_SERVER + resource)
          .end(rdv);
      }
    });
  });
});

/*
 * Week 4 -- Exercice 1 tests
 */
describe('Week 4 - exercice 1', function(){
  this.timeout(TIMEOUT);

  beforeEach(function(done){
    /* Nice trick to run several concurent actions and wait for them */
    var rdv = rendezVous(3, done);

    Promotions.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
        if (err) console.log(err);
        Promotions.insertMany(promotions_fixture, rdv);
    });
    Dishes.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
        if (err) console.log(err);
        Dishes.insertMany(dishes_fixture, rdv);
    });

    /* moved beforeEach as some test cases thins week alter the User collection */
    /* a better solution would have been to factor that out in a different */
    /* test suite -- but for sake of simplicity, I've grouped things by exercise... */
    User.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
        if (err) console.log(err);
        User.insertMany(users_fixture, rdv);
    });
  });

  describe('User', function(){
    it('can return their full name', function(done) {
      var user = new User({
          username: "jogesh",
          password: "Sesame^open",
          firstname: "Jogesh",
          lastname: "Muppala",
      });

      assert.equal(user.getName(), "Jogesh Muppala");
      done();
    });

    it('will return the first name a full name if there is no last name', function(done) {
      var user = new User({
          username: "jogesh",
          password: "Sesame^open",
          firstname: "Jogesh",
      });

      assert.equal(user.getName(), "Jogesh "); // FIXME ugly space after first name !!!
      done();
    });

    it('will return the last name a full name if there is no first name', function(done) {
      var user = new User({
          username: "jogesh",
          password: "Sesame^open",
          lastname: "Muppala",
      });

      assert.equal(user.getName(), " Muppala"); // FIXME ugly space before last name !!!
      done();
    });

    it('may have first and last name set', function(done) {
      login("admin", "password", function(auth_res) {
        var user = {
            username: "jogesh",
            password: "Sesame^open",
            firstname: "Jogesh",
            lastname: "Muppala",
        };
        request(SERVER)
          .post('/users/register')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .send(user)
          .expect(HTTP_CREATED)
          .end(function() {
            User.find({username:user.username}, function(err, found) {
              assert.ok(found);
              assert.equal(found.length, 1);
              assert.equal(found[0].username, user.username);
              assert.equal(found[0].firstname, user.firstname);
              assert.equal(found[0].lastname, user.lastname);
              assert.equal(found[0].admin, false);

              done();
            })

          });
      });
    });

    it('have a default first name', function(done) {
      login("admin", "password", function(auth_res) {
        var user = {
            username: "jogesh",
            password: "Sesame^open",
            lastname: "Muppala",
        };
        request(SERVER)
          .post('/users/register')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .send(user)
          .expect(HTTP_CREATED)
          .end(function() {
            User.find({username:user.username}, function(err, found) {
              assert.ok(found);
              assert.equal(found.length, 1);
              assert.equal(found[0].username, user.username);
              assert.equal(found[0].firstname, '');
              assert.equal(found[0].lastname, user.lastname);
              assert.equal(found[0].admin, false);

              done();
            })
          });
      });
    });

    it('have a default last name', function(done) {
      login("admin", "password", function(auth_res) {
        var user = {
            username: "jogesh3",
            password: "Sesame^open",
            firstname: "Jogesh",
        };
        request(SERVER)
          .post('/users/register')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .send(user)
          .expect(HTTP_CREATED)
          .end(function() {
            User.find({username:user.username}, function(err, found) {
              assert.ok(found);
              assert.equal(found.length, 1);
              assert.equal(found[0].username, user.username);
              assert.equal(found[0].firstname, user.firstname);
              assert.equal(found[0].lastname, '');
              assert.equal(found[0].admin, false);

              done();
            })
          });
      });
    });

    it('is allowed to log in after creation', function(done) {
      login("admin", "password", function(auth_res) {
        var user = {
            username: "jogesh2",
            password: "Sesame^open",
            firstname: "Jogesh",
        };
        request(SERVER)
          .post('/users/register')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .send(user)
          .expect(HTTP_CREATED)
          .end(function() {
            login(user.username, user.password, function(user_res) {
              assert.ok(user_res);
              assert.ok(user_res.body);
              // console.log(user_res);
              assert.ok(user_res.body.status);
              assert.ok(user_res.body.token);
              Verify.verifyOrdinaryUser(user_res, undefined, function(err) {
                //console.log(user_res);
                assert.ok(!err);
                assert.equal(user_res.decoded._doc.username, user.username);
                assert.equal(user_res.decoded._doc.admin, false);

                done();
              });
            });
          });
      });
    });


  });

  describe('GET /dishes', function(){
    it('should populate comment authors for all dishes', function(done) {
      login("anson", "password", function(auth_res) {
        request(SERVER)
          .get('/dishes')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .expect(HTTP_OK)
          .expect(function(res) {
            for(var dish of res.body) {
              for(var comment of dish.comments) {
                /* should be an object (incl. "null") */
                assert.equal(typeof comment.postedBy, 'object');
                if (comment.postedBy) {
                  assert.notEqual(typeof comment.postedBy._id, "undefined");
                  assert.notEqual(typeof comment.postedBy.username, "undefined");
                  assert.notEqual(typeof comment.postedBy.firstname, "undefined");
                  assert.notEqual(typeof comment.postedBy.lastname, "undefined");
                  assert.notEqual(typeof comment.postedBy.admin, "undefined");
                }
              }
            }
          })
          .end(done);
      });
    });
  });

  describe('GET /dishes/:id', function(){
    it('should populate comment author', function(done) {
      login("anson", "password", function(auth_res) {
        request(SERVER)
          .get('/dishes/000000000000000000001200')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .expect(HTTP_OK)
          .expect(function(res) {
            var comment = res.body.comments[0];
            var user = users_fixture[0]; // hard coded for the test

            assert.equal(comment.postedBy._id, user._id);
            assert.equal(comment.postedBy.username, user.username);
            assert.equal(comment.postedBy.firstname, user.firstname);
            assert.equal(comment.postedBy.lastname, user.lastname);
            assert.equal(comment.postedBy.admin, user.admin);
          })
          .end(done);
      });
    });

    it('should be set to null for non-existant users', function(done) {
      login("anson", "password", function(auth_res) {
        console.log(SERVER);
        request(SERVER)
          .get('/dishes/000000000000000000001200')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .expect(HTTP_OK)
          .expect(function(res) {
            var comment = res.body.comments[1];
            assert.strictEqual(comment.postedBy, null);
          })
          .end(done);
      });
    });
  });

  describe('GET /dishes/:id/comments', function(){
    it('should return all comments with populated authors', function(done) {
      login("anson", "password", function(auth_res) {
        request(SERVER)
          .get('/dishes/000000000000000000001200/comments')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .expect(HTTP_OK)
          .expect(function(res) {
            var comments = res.body;
            assert.notEqual(comments.length, 0); // ensure we have at least one comment in our test case
            for(var comment of comments) {
              /* should be an object (incl. "null") */
              assert.equal(typeof comment.postedBy, 'object');
              if (comment.postedBy) {
                assert.notEqual(typeof comment.postedBy._id, "undefined");
                assert.notEqual(typeof comment.postedBy.username, "undefined");
                assert.notEqual(typeof comment.postedBy.firstname, "undefined");
                assert.notEqual(typeof comment.postedBy.lastname, "undefined");
                assert.notEqual(typeof comment.postedBy.admin, "undefined");
              }
            }
          })
          .end(done);
      });
    });

  });

  describe('GET /dishes/:id/comments/:id', function(){
    it('should populate comment author', function(done) {
      login("anson", "password", function(auth_res) {
        request(SERVER)
          .get('/dishes/000000000000000000001300/comments/000000000000000000001302')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .expect(HTTP_OK)
          .expect(function(res) {
            var comment = res.body;
            // Hard coded values for the test
            assert.strictEqual(comment.postedBy._id, "570751b010f8b3ba29439e53");
            assert.strictEqual(comment.postedBy.username, "sonia");
            assert.strictEqual(comment.postedBy.firstname, "Sonia");
            assert.strictEqual(comment.postedBy.lastname, "");
            assert.strictEqual(comment.postedBy.admin, false);
          })
          .end(done);
      });
    });

  });

  describe('POST /dishes/:id/comments', function(){
    it('should store the logged user as author', function(done) {
      login("anson", "password", function(auth_res) {
        var new_comment = {
          rating: 3,
          comment: "Good dish",
        };
        request(SERVER)
          .post('/dishes/000000000000000000001300/comments')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .send(new_comment)
          .expect(HTTP_CREATED)
          .expect(function(res) {
            assert.equal(res.body.comments.length, dishes_fixture[2].comments.length+1);
            var comment = res.body.comments[res.body.comments.length-1];

            assert.strictEqual(comment.postedBy, "570751ca10f8b3ba29439e54");
            assert.strictEqual(comment.rating, new_comment.rating);
            assert.strictEqual(comment.comment, new_comment.comment);
          })
          .end(done);
      });
    });
  });

  describe('PUT /dishes/:id/comments/:id', function(){
    it('should update the author', function(done) {
      login("admin", "password", function(auth_res) {
        var new_comment = {
          rating: 3,
          comment: "Good dish",
        };
        request(SERVER)
          .put('/dishes/000000000000000000001300/comments/000000000000000000001303')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .send(new_comment)
          .expect(HTTP_OK)
          .expect(function(res) {
            assert.equal(res.body.comments.length, dishes_fixture[2].comments.length);
            var comment = res.body.comments[res.body.comments.length-1];

            assert.strictEqual(comment.postedBy, "570751de10f8b3ba29439e55");
            assert.strictEqual(comment.rating, new_comment.rating);
            assert.strictEqual(comment.comment, new_comment.comment);
          })
          .end(done);
      });
    });
  });


  describe('DELETE /dishes/:id/comments/:id', function(){
    it('is authorized when the user is the author', function(done) {
      login("anson", "password", function(auth_res) {
        var new_comment = {
          rating: 3,
          comment: "Good dish",
        };
        request(SERVER)
          .delete('/dishes/000000000000000000001300/comments/000000000000000000001301')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .expect(HTTP_OK)
          .expect(function(res) {
            assert.equal(res.body.comments.length, dishes_fixture[2].comments.length-1);
            assert.equal(res.body.comments.find(function(item) { item.postedBy === dishes_fixture[2].comments[0]._id}), undefined);
          })
          .end(done);
      });
    });
    it('is forbidden when the user is the author', function(done) {
      login("anson", "password", function(auth_res) {
        var new_comment = {
          rating: 3,
          comment: "Good dish",
        };
        request(SERVER)
          .delete('/dishes/000000000000000000001300/comments/000000000000000000001302')
          .set('Accept', 'application/json')
          .set('x-access-token', auth_res.body.token)
          .expect(HTTP_FORBIDDEN)
          .end(done);
      });
    });
  });


});



/*
 * Assignment 3 tests
 */
describe('Verify permission', function(){
  this.timeout(TIMEOUT);

  before(function(done) {
    User.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
        User.insertMany(users_fixture, done);
    });
  });

  beforeEach(function(done){
    Promotions.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
        Promotions.insertMany(promotions_fixture, done);
    });
  });

  describe('GET /users', function(){
    it('returns all users when authenticated as admin', function(done){
      login("admin", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .get('/users')
          .set('x-access-token', token)
          //.expect(console.log)
          .expect('Content-Type', /json/)
          .expect(HTTP_OK)
          .expect(function(res) {
            // hash & salt are hidden in the result set
            var expected = users_fixture.map(function (item) {
              /* Ugly clone ? */
              var copy = JSON.parse(JSON.stringify(item));

              delete copy.hash;
              delete copy.salt;
              return copy;
            });

            assert.deepEqual(res.body, expected);
          })
          .end(done);
      });
    });

    it('is forbidden when authenticated as normal user', function(done){
      login("anson", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .get('/users')
          .set('x-access-token', token)
          .expect(HTTP_FORBIDDEN)
          .expect(/You are not authorized to perform this operation!/) // required by assignment 3 task 3
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(SERVER)
        .get('/promotions')
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });


  describe('GET /promotions', function(){
    it('returns all promotions when authenticated', function(done){
      login("anson", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .get('/promotions')
          .set('x-access-token', token)
          .expect('Content-Type', /json/)
          .expect(HTTP_OK)
          .expect(function(res) {
            assert.deepEqual(res.body, promotions_fixture);
          })
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(SERVER)
        .get('/promotions')
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });


  });

  describe('POST /promotions', function(){
    it('post a dish when authenticated as admin', function(done){
      login("admin", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .post('/promotions')
          .set('x-access-token', token)
          .send(new_promotion)
          //.expect(console.log)
          .expect('Content-Type', /json/)
          .expect(HTTP_CREATED)
          .expect(function(res) {
            assert.ok(res.body._id);
            assert.equal(res.body.name, new_promotion.name);
            assert.equal(res.body.image, new_promotion.image);
            assert.equal(res.body.label, new_promotion.label);
            assert.equal(res.body.price, new_promotion.price);
            assert.equal(res.body.description, new_promotion.description);
          })
          .end(done);
      });
    });

    it('is forbidden when authenticated as normal user', function(done){
      login("anson", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .post('/promotions')
          .set('x-access-token', token)
          .expect(HTTP_FORBIDDEN)
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(SERVER)
        .post('/promotions')
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });


  describe('DELETE /promotions', function(){
    it('delete all dishes when authenticated as admin', function(done){
      login("admin", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .delete('/promotions')
          .set('x-access-token', token)
          .send(new_promotion)
          //.expect(console.log)
          .expect(function(res) {
            assert.deepEqual(res.body, { ok: 1, n: promotions_fixture.length });
          })
          .end(done);
      });
    });

    it('is forbidden when authenticated as normal user', function(done){
      login("anson", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .delete('/promotions')
          .set('x-access-token', token)
          .expect(HTTP_FORBIDDEN)
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(SERVER)
        .delete('/promotions')
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });

  describe('GET /promotions/:id', function(){
    it('returns a promotions when authenticated', function(done){
      login("anson", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .get('/promotions/' + promotions_fixture[0]._id)
          .set('x-access-token', token)
          .expect('Content-Type', /json/)
          .expect(HTTP_OK)
          .expect(function(res) {
            assert.deepEqual(res.body, promotions_fixture[0]);
          })
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(SERVER)
        .get('/promotions/' + promotions_fixture[0]._id)
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });

  describe('PUT /promotions/:id', function(){
    it('change a promotions when authenticated as admin', function(done){
      login("admin", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .put('/promotions/' + promotions_fixture[0]._id)
          .send(new_promotion)
          .set('x-access-token', token)
          .expect('Content-Type', /json/)
          .expect(HTTP_OK)
          .expect(function(res) {
            assert.equal(res.body._id, promotions_fixture[0]._id);
            assert.equal(res.body.name, new_promotion.name);
            assert.equal(res.body.image, new_promotion.image);
            assert.equal(res.body.label, new_promotion.label);
            assert.equal(res.body.price, new_promotion.price);
            assert.equal(res.body.description, new_promotion.description);
          })
          .end(done);
      });
    });

    it('is forbidden when authenticated as normal user', function(done){
      login("anson", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .put('/promotions/' + promotions_fixture[0]._id)
          .send(new_promotion)
          .set('x-access-token', token)
          .expect(HTTP_FORBIDDEN)
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(SERVER)
        .put('/promotions/' + promotions_fixture[0]._id)
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });

  describe('DELETE /promotions/:id', function(){
    it('remove a promotions when authenticated as admin', function(done){
      login("admin", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .delete('/promotions/' + promotions_fixture[0]._id)
          .set('x-access-token', token)
          .expect('Content-Type', /json/)
          .expect(HTTP_OK)
          .expect(function(res) {
            assert.equal(res.body._id, promotions_fixture[0]._id);
            assert.equal(res.body.name, promotions_fixture[0].name);
            assert.equal(res.body.image, promotions_fixture[0].image);
            assert.equal(res.body.label, promotions_fixture[0].label);
            assert.equal(res.body.price, promotions_fixture[0].price);
            assert.equal(res.body.description, promotions_fixture[0].description);
          })
          .end(done);
      });
    });

    it('returns 403 when authenticated as normal user', function(done){
      login("anson", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(SERVER)
          .delete('/promotions/' + promotions_fixture[0]._id)
          .set('x-access-token', token)
          .expect(HTTP_FORBIDDEN)
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(SERVER)
        .delete('/promotions/' + promotions_fixture[0]._id)
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });

});
