/* test/test_assignment3.js

   run me by typing in a terminal from the project root:

   ./node_modules/.bin/mocha test/test_assignment3.js
*/

var request = require('supertest');
var assert = require('assert');
var mongoose = require('mongoose');

var app = require('../app');
var Promotions = require('../models/promotions');
var User = require('../models/user');

var STRICT_REST = true; // change that to false depending on https://www.coursera.org/learn/server-side-development/lecture/bKtMl/exercise-video-rest-api-with-express-mongodb-and-mongoose/discussions/x1AZIu9SEeWB0QpuSDkq-Q
var HTTP_OK = 200;
var HTTP_CREATED = (STRICT_REST) ? 201 : HTTP_OK;
var HTTP_FORBIDDEN = 403;
var HTTP_UNAUTHORIZED = (STRICT_REST) ? 401 : HTTP_FORBIDDEN; // See http://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
var HTTP_NOT_FOUND = 404;

/*
 * Data
 */
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
function login(username, password, callback) {
  request(app)
    .post('/users/login')
    .send({username: username, password: password})
    .end(function(err, res) {
      if (err) throw err;
      callback(res);
    });
}

/*
 * Tests
 */
describe('Verify permission', function(){
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
        request(app)
          .get('/users')
          .set('x-access-token', token)
          //.expect(console.log)
          .expect('Content-Type', /json/)
          .expect(HTTP_OK)
          .expect(function(res) {
            // hash & salt are hidden in the result set
            var expected = users_fixture.map(function (item) {
              return {__v: item.__v, _id:item._id, admin: item.admin, username: item.username};
            });

            assert.deepEqual(res.body, expected);
          })
          .end(done);
      });
    });

    it('is forbidden when authenticated as normal user', function(done){
      login("anson", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(app)
          .get('/users')
          .set('x-access-token', token)
          .expect(HTTP_FORBIDDEN)
          .expect(/You are not authorized to perform this operation!/) // required by assignment 3 task 3
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(app)
        .get('/promotions')
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });


  describe('GET /promotions', function(){
    it('returns all promotions when authenticated', function(done){
      login("anson", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(app)
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
      request(app)
        .get('/promotions')
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });


  });

  describe('POST /promotions', function(){
    it('post a dish when authenticated as admin', function(done){
      login("admin", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(app)
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
        request(app)
          .post('/promotions')
          .set('x-access-token', token)
          .expect(HTTP_FORBIDDEN)
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(app)
        .post('/promotions')
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });


  describe('DELETE /promotions', function(){
    it('delete all dishes when authenticated as admin', function(done){
      login("admin", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(app)
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
        request(app)
          .delete('/promotions')
          .set('x-access-token', token)
          .expect(HTTP_FORBIDDEN)
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(app)
        .delete('/promotions')
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });

  describe('GET /promotions/:id', function(){
    it('returns a promotions when authenticated', function(done){
      login("anson", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(app)
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
      request(app)
        .get('/promotions/' + promotions_fixture[0]._id)
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });

  describe('PUT /promotions/:id', function(){
    it('change a promotions when authenticated as admin', function(done){
      login("admin", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(app)
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
        request(app)
          .put('/promotions/' + promotions_fixture[0]._id)
          .send(new_promotion)
          .set('x-access-token', token)
          .expect(HTTP_FORBIDDEN)
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(app)
        .put('/promotions/' + promotions_fixture[0]._id)
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });

  describe('DELETE /promotions/:id', function(){
    it('remove a promotions when authenticated as admin', function(done){
      login("admin", "password", function(auth_res) {
        var token = auth_res.body.token;
        request(app)
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
        request(app)
          .delete('/promotions/' + promotions_fixture[0]._id)
          .set('x-access-token', token)
          .expect(HTTP_FORBIDDEN)
          .end(done);
      });
    });

    it('returns "unauthorized" when not properly authenticated', function(done){
      request(app)
        .delete('/promotions/' + promotions_fixture[0]._id)
        .expect(HTTP_UNAUTHORIZED)
        .end(done);
    });

  });

});
