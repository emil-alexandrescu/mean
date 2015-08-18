'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Price = mongoose.model('Price'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a price
 */
exports.create = function (req, res) {
  var price = new Price(req.body);
  price.material = req.material;
  price.girth = req.girth;

  price.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(price);
    }
  });
};


/**
 * Show the current price
 */
exports.read = function (req, res) {
  res.json(req.price);
};


/**
 * Update a price
 */
exports.update = function (req, res) {
  var price = req.price;
  price.price = req.body.price;

  price.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(price);
    }
  });
};

/**
 * List of Prices
 */
exports.list = function (req, res) {
  Price.find({}).sort('created').exec(function (err, prices) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(prices);
  });
};


/**
 * Delete a Price
 */
exports.delete = function (req, res) {
  var price = req.price;

  price.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(price);
  });
};


/**
 * Price middleware
 */
exports.findPriceByMaterialAndGirth = function (req, res, next) {
  Price.findOne({material: req.material, girth: req.girth}).exec(function (err, price) {
    if (err) {
      return next(err);
    } else if (!price) {
      return next(new Error('Failed to load price'));
    }
    req.price = price;
    next();
  });
};
