'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Drawing = mongoose.model('Drawing'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a drawing
 */
exports.create = function (req, res) {
  var drawing = new Drawing(req.body);
  drawing.material = req.material;
  drawing.girth = req.girth;

  drawing.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(drawing);
    }
  });
};


/**
 * Show the current drawing
 */
exports.read = function (req, res) {
  res.json(req.drawing);
};


/**
 * Update a drawing
 */
exports.update = function (req, res) {
  var drawing = req.drawing;
  drawing.body = req.body.body;
  drawing.title = req.body.title;
  drawing.girth = req.girth;
  drawing.material = req.material;

  drawing.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(drawing);
    }
  });
};

/**
 * List of Drawings
 */
exports.list = function (req, res) {
  Drawing.find({}).sort('size').populate('drawing').exec(function (err, drawings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(drawings);
  });
};


/**
 * Delete a Drawing
 */
exports.delete = function (req, res) {
  var drawing = req.drawing;

  drawing.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(drawing);
  });
};

/**
 * Drawing middleware
 */
function drawingById(req, res, next, id){
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Drawing is invalid'
    });
  }

  Drawing.findById(id).exec(function (err, drawing) {
    if (err) {
      return next(err);
    } else if (!drawing) {
      return next(new Error('Failed to load drawing ' + id));
    }
    req.drawing = drawing;
    next();
  });
}

exports.drawingById = function (req, res, next, id) {
  return drawingById(req, res, next, id);
};

exports.drawingByBodyId = function (req, res, next) {
  return drawingById(req, res, next, req.body.drawingId);
};

