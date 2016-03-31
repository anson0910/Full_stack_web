/* Mocha unit tests to test models
  Usage: mocha test/test_models.js
*/

var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

var assert = require('assert');

var Dishes = require('../models/dishes');
var Promotions = require('../models/promotions');
var Leaders = require('../models/leadership');

describe('Dishes', function(){
  beforeEach(function(done){
    // don't use drop() as this will sometimes raise a background operation error
    Dishes.remove({}, done);
  });
  describe('Creation', function() {
    it('should create a new document AS IT', function(done) {
      var req = {
          name: 'Uthapizza',
          image: 'that.png',
          category: 'main',
          price: '10.00',
          label: 'hot',
          description: 'Test',
      };
      Dishes.create(req, function (err, res) {
              if (err) throw err;

              assert.equal(res.name, req.name);
              assert.equal(res.image, req.image);
              assert.equal(res.category, req.category);
              assert.equal(res.price, "1000");
              assert.equal(res.label, req.label);
              assert.equal(res.description, req.description);

              done();
      });
    });

    it('should set label to an empty string', function(done) {
      var req = {
          name: 'Uthapizza',
          image: 'that.png',
          category: 'main',
          price: '10.00',
          description: 'Test',
      };
      Dishes.create(req, function (err, res) {
              if (err) throw err;

              assert.equal(res.label, "");
              done();
      });
    });

    it('should fail because of missing fields', function(done) {
      var req = {
      };
      Dishes.create(req, function (err, res) {
              assert.equal(err.errors.name.name, 'ValidatorError');
              assert.equal(err.errors.image.name, 'ValidatorError');
              assert.equal(err.errors.category.name, 'ValidatorError');
              assert.equal(err.errors.price.name, 'ValidatorError');
              assert.equal(err.errors.description.name, 'ValidatorError');

              done();
      });
    });

    it('should silently discard currency in prices', function(done) {
      var req = {
          name: 'Uthapizza',
          image: 'that.png',
          category: 'main',
          price: '€10.50',
          description: 'Test',
      };
      Dishes.create(req, function (err, res) {
              if (err) throw err;

              assert.equal(res.price, "1050");
              done();
      });
    });

  });
});

describe('Promotions', function(){
  beforeEach(function(done){
    Promotions.remove({}, done); // don't use drop() as this will sometimes raise a background operation error
  });
  describe('Creation', function() {
    it('should create a new document AS IT', function(done) {
      var req = {
          name: "Weekend Grand Buffet",
          image: "images/buffet.png",
          label: "New",
          price: "19.99",
          description: "Featuring . . ."
      };
      Promotions.create(req, function (err, res) {
              if (err) throw err;

              assert.equal(res.name, req.name);
              assert.equal(res.image, req.image);
              assert.equal(res.label, req.label);
              assert.equal(res.price, "1999");
              assert.equal(res.description, req.description);

              done();
      });
    });

    it('should set label to an empty string', function(done) {
      var req = {
          name: "Weekend Grand Buffet",
          image: "images/buffet.png",
          price: "19.99",
          description: "Featuring . . ."
      };
      Promotions.create(req, function (err, res) {
              if (err) throw err;

              assert.equal(res.label, "");
              done();
      });
    });

    it('should fail because of missing fields', function(done) {
      var req = {
      };
      Promotions.create(req, function (err, res) {
              assert.equal(err.errors.name.name, 'ValidatorError');
              assert.equal(err.errors.image.name, 'ValidatorError');
              assert.equal(err.errors.price.name, 'ValidatorError');
              assert.equal(err.errors.description.name, 'ValidatorError');

              done();
      });
    });

    it('should silently discard currency in prices', function(done) {
      var req = {
          name: "Weekend Grand Buffet",
          image: "images/buffet.png",
          price: "£19.99",
          description: "Featuring . . ."
      };
      Promotions.create(req, function (err, res) {
              if (err) throw err;

              assert.equal(res.price, "1999");
              done();
      });
    });

  });
});

describe('Leaders', function(){
  beforeEach(function(done){
    Leaders.remove({}, done); // don't use drop() as this will sometimes raise a background operation error
  });
  describe('Creation', function() {
    it('should create a new document AS IT', function(done) {
      var req = {
          "name": "Peter Pan",
          "image": "images/alberto.png",
          "designation": "Chief Epicurious Officer",
          "abbr": "CEO",
          "description": "Our CEO, Peter, . . ."
      };
      Leaders.create(req, function (err, res) {
              if (err) throw err;

              assert.equal(res.name, req.name);
              assert.equal(res.image, req.image);
              assert.equal(res.designation, req.designation);
              assert.equal(res.abbr, req.abbr);
              assert.equal(res.description, req.description);

              done();
      });
    });

    it('should fail because of missing fields', function(done) {
      var req = {
      };
      Leaders.create(req, function (err, res) {
              assert.equal(err.errors.name.name, 'ValidatorError');
              assert.equal(err.errors.image.name, 'ValidatorError');
              assert.equal(err.errors.designation.name, 'ValidatorError');
              assert.equal(err.errors.abbr.name, 'ValidatorError');
              assert.equal(err.errors.description.name, 'ValidatorError');

              done();
      });
    });

  });
});
