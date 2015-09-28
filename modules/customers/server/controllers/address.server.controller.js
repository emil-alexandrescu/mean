'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Address = mongoose.model('Address'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create an address
 */
exports.create = function (req, res) {
  var address = new Address(req.body);
  address.customer = req.customer;

  address.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(address);
    }
  });
};


/**
 * Show the current address
 */
exports.read = function (req, res) {
  res.json(req.address);
};


/**
 * Update a address
 */
exports.update = function (req, res) {
  var address = req.address;

  address = _.extend(address, _.pick(req.body,
    'first_name',
    'last_name', 
    'street_line1',
    'street_line2',
    'street_line3',
    'street_line4',
    'city',
    'state',
    'country',
    'zipcode'
  ));

  address.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(address);
    }
  });
};

/**
 * List of Address for a customer
 */
exports.list = function (req, res) {
  Address.find({customer: req.customer}).sort('-created').populate('address').exec(function (err, addresses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(addresses);
  });
};


/**
 * Delete a Address
 */
exports.delete = function (req, res) {
  var address = req.address;

  address.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(address);
  });
};

/**
 * Address middleware
 */
 function addressById(req, res, next, id){
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Address is invalid'
    });
  }

  Address.findById(id).exec(function (err, address) {
    if (err) {
      return next(err);
    } else if (!address) {
      return next(new Error('Failed to load address ' + id));
    }
    req.address = address;
    next();
  });
}

exports.addressById = function (req, res, next, id) {
  return addressById(req, res, next, id);
};

exports.addressByBodyId = function (req, res, next) {
  return addressById(req, res, next, req.body.addressId);
};

