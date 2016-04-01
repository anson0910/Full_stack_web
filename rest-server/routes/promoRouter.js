var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Promotions = require('../models/promotions');

var promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
  .get(function(req, res, next) {
    Promotions.find({}, function(err, promotions) {
      if (err)  throw err;
      // Return promotions in JSON format
      res.json(promotions);
    });
  })

  .post(function(req, res, next) {
    Promotions.create(req.body, function(err, promotion) {
      if (err)  throw err;
      console.log("Promotion created!");
      var id = promotion._id;
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end("Added the promotion with id: " + id);
    });
  })

  .delete(function(req, res, next) {
    Promotions.remove({}, function(err, resp) {
      if (err)  throw err;
      res.json(resp);
    });
  });

promotionRouter.route('/:promotionId')
  .get(function(req, res, next) {
    Promotions.findById(req.params.promotionId, function(err, promotion) {
      if (err)  throw err;
      res.json(promotion);
    });
  })

  .put(function(req, res, next) {
    Promotions.findByIdAndUpdate(req.params.promotionId, {
      $set: req.body
    }, {
      new: true
    }, function(err, promotion) {

      res.json(promotion);
    });
  })

  .delete(function(req, res, next) {
    Promotions.findByIdAndRemove(req.params.promotionId, function(err, resp) {
      if (err)  throw err;
      res.json(resp);
    });
  });

module.exports = promotionRouter;
