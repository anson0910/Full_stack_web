var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Promotions = require('../models/promotions');

var Verify = require('./verify');

var promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
  .get(Verify.verifyOrdinaryUser, function(req, res, next) {
    Promotions.find({}, function(err, promotions) {
      if (err)  throw err;
      // Return promotions in JSON format
      res.json(promotions);
    });
  })

  .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Promotions.create(req.body, function(err, promotion) {
      if (err)  throw err;
      console.log("Promotion created!");
      var id = promotion._id;
      // Can respond with text or json data
      res.status(201);
      res.json(promotion);
      // res.writeHead(201, {
      //   'Content-Type': 'text/plain'
      // });
      //res.end("Added the promotion with id: " + id);
    });
  })

  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Promotions.remove({}, function(err, resp) {
      if (err)  throw err;
      res.json(resp);
    });
  });

promotionRouter.route('/:promotionId')
  .get(Verify.verifyOrdinaryUser, function(req, res, next) {
    Promotions.findById(req.params.promotionId, function(err, promotion) {
      if (err)  throw err;
      res.json(promotion);
    });
  })

  .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Promotions.findByIdAndUpdate(req.params.promotionId, {
      $set: req.body
    }, {
      new: true
    }, function(err, promotion) {

      res.json(promotion);
    });
  })

  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Promotions.findByIdAndRemove(req.params.promotionId, function(err, resp) {
      if (err)  throw err;
      res.json(resp);
    });
  });

module.exports = promotionRouter;
