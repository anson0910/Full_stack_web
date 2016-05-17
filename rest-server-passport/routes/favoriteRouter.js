var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');

var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
  .all(Verify.verifyOrdinaryUser)   // users must be logged in to see, update or delete favorites
  .get(function(req, res, next) {
    // Retrieve id from request message decoded by Verify.verifyOrdinaryUser
    Favorites.findOne({'postedBy': req.decoded._id})
      .populate('postedBy')
      .populate('dishes')
      .exec(function(err, favorite)  {
        if (err)  next(err);
        res.json(favorite);
      });
  })

  .post(function(req, res, next) {
    Favorites.findOne({'postedBy': req.decoded._id})
      .populate('postedBy')
      .populate('dishes')
      .exec(function(err, favorite)  {
        if (err)  next(err);
        if (!favorite)  {
          favorite = {
            postedBy: req.decoded._id,
            dishes: [req.body._id]
          };
          Favorites.create(favorite, function(err, favorite)  {
            console.log("Favorite list created!");
            res.status(201);
            res.json(favorite);
          });
        }
        else {
          favorite.dishes.push(req.body._id);
          favorite.save(function(err, favorite) {
            if (err)  next(err);
            console.log("Updated favorites!");
            res.status(201);
            res.json(favorite);
          });
        }
      });
  })

  .delete(function(req, res, next) {
    var favorites = Favorites.findOne({'postedBy': req.decoded._id}, function(err, favorites)  {
      if (err)  next(err);
      favorites.remove();
      res.json(favorites);
    });
  });


favoriteRouter.route('/:dishId')
  .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
    Favorites.findOne({'postedBy': req.decoded._id}, function(err, favorites)  {
      if (err)  next(err);
      var index = favorites.dishes.indexOf(req.params.dishId);
      if (index > -1) {
        favorites.dishes.splice(index, 1);
      }
      favorites.save(function(err, resp) {
        if (err)  next(err);
        res.json(resp);
      });
    });
  });

module.exports = favoriteRouter;
