'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Work = mongoose.model('Work'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a work
 */
exports.create = function (req, res) {
  var work = new Work(req.body);
  work.customer = req.customer;
  work.address = req.address;
  work.drawing = req.drawing;

  work.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(work);
    }
  });
};


/**
 * Show the current work
 */
exports.read = function (req, res) {
  res.json(req.work);
};


/**
 * Update a work
 */
exports.update = function (req, res) {
  var work = req.work;
  work.title = req.body.title;
  work.description = req.body.description;
  work.order_number = req.body.order_number;
  work.req_date = req.body.req_date;
  work.delivery_charge = req.body.delivery_charge;
  work.price = req.body.price;
  work.tax = req.body.tax;
  work.status = req.body.status;
  work.order_or_quote = req.body.order_or_quote;
  work.customer = req.customer;
  work.address = req.address;
  work.drawing = req.drawing;

  work.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(work);
    }
  });
};

/**
 * List of Works
 */
exports.list = function (req, res) {
  Work.find({}).populate('work').exec(function (err, works) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(works);
  });
};


/**
 * Delete a Work
 */
exports.delete = function (req, res) {
  var work = req.work;

  work.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(work);
  });
};

/**
 * User middleware
 */
exports.workById = function (req, res, next, id) {
  id = id || req.body.workId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Work is invalid'
    });
  }

  Work.findById(id).populate(['drawing', 'customer', 'address']).exec(function (err, work) {
    if (err) {
      return next(err);
    } else if (!work) {
      return next(new Error('Failed to load work ' + id));
    }
    req.work = work;
    next();
  });
};
