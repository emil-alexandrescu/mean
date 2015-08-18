'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Material = mongoose.model('Material'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a material
 */
exports.create = function (req, res) {
  var material = new Material(req.body);

  material.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(material);
    }
  });
};


/**
 * Show the current material
 */
exports.read = function (req, res) {
  res.json(req.material);
};


/**
 * Update a material
 */
exports.update = function (req, res) {
  var material = req.material;
  material.title = req.body.title;
  material.description = req.body.description;

  material.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(material);
    }
  });
};

/**
 * List of Materials
 */
exports.list = function (req, res) {
  Material.find({}).sort('created').populate('material').exec(function (err, materials) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(materials);
  });
};


/**
 * Delete a Material
 */
exports.delete = function (req, res) {
  var material = req.material;

  material.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(material);
  });
};

/**
 * Material middleware
 */
exports.materialById = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Material is invalid'
    });
  }

  Material.findById(id).exec(function (err, material) {
    if (err) {
      return next(err);
    } else if (!material) {
      return next(new Error('Failed to load material ' + id));
    }
    req.material = material;
    next();
  });
};
