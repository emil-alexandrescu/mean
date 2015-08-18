'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Girth = mongoose.model('Girth'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a girth
 */
exports.create = function (req, res) {
  var girth = new Girth(req.body);

  girth.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(girth);
    }
  });
};


/**
 * Show the current girth
 */
exports.read = function (req, res) {
  res.json(req.girth);
};


/**
 * Update a girth
 */
exports.update = function (req, res) {
  var girth = req.girth;
  girth.size = req.body.size;
  girth.description = req.body.description;

  girth.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(girth);
    }
  });
};

/**
 * List of Girths
 */
exports.list = function (req, res) {
  Girth.find({}).sort('size').populate('girth').exec(function (err, girths) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(girths);
  });
};


/**
 * Delete a Girth
 */
exports.delete = function (req, res) {
  var girth = req.girth;

  girth.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(girth);
  });
};

/**
 * User middleware
 */
exports.girthById = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Girth is invalid'
    });
  }

  Girth.findById(id).exec(function (err, girth) {
    if (err) {
      return next(err);
    } else if (!girth) {
      return next(new Error('Failed to load girth ' + id));
    }
    req.girth = girth;
    next();
  });
};
