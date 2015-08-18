'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ContactInfo = mongoose.model('ContactInfo'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create an contact_info
 */
exports.create = function (req, res) {
  var contact_info = new ContactInfo(req.body);
  contact_info.customer = req.customer;

  contact_info.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contact_info);
    }
  });
};


/**
 * Show the current contact_info
 */
exports.read = function (req, res) {
  res.json(req.contact_info);
};


/**
 * Update a contact_info
 */
exports.update = function (req, res) {
  var contact_info = req.contact_info;

  contact_info = _.extend(contact_info, _.pick(req.body,
    'contact_type',
    'contact_value'
  ));

  contact_info.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contact_info);
    }
  });
};

/**
 * List of ContactInfo for a customer
 */
exports.list = function (req, res) {

  ContactInfo.find({customer: req.customer}).sort('-created').populate('contact_info').exec(function (err, contact_infoes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(contact_infoes);
  });
};


/**
 * Delete a ContactInfo
 */
exports.delete = function (req, res) {
  var contact_info = req.contact_info;

  contact_info.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(contact_info);
  });
};

/**
 * User middleware
 */
exports.contact_infoById = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'ContactInfo is invalid'
    });
  }

  ContactInfo.findById(id).exec(function (err, contact_info) {
    if (err) {
      return next(err);
    } else if (!contact_info) {
      return next(new Error('Failed to load contact_info ' + id));
    }
    req.contact_info = contact_info;
    next();
  });
};
