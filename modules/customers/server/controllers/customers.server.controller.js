'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a customer
 */
exports.create = function (req, res) {
  var customer = new Customer(req.body);

  customer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(customer);
    }
  });
};


/**
 * Show the current customer
 */
exports.read = function (req, res) {
  res.json(req.customer);
};


/**
 * Update a customer
 */
exports.update = function (req, res) {
  var customer = req.customer;
  customer.first_name = req.body.first_name;
  customer.last_name = req.body.last_name;
  customer.company = req.body.company;

  customer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(customer);
    }
  });
};

/**
 * List of Customers
 */
exports.list = function (req, res) {
  var query = req.query.q || '';
  Customer.find({
    $or: [
      {
        first_name: new RegExp(query, 'i')
      },
      {
        last_name: new RegExp(query, 'i')
      },
      {
        company: new RegExp(query, 'i')
      }
    ]
  }).sort('-created').populate('customer', 'displayName').exec(function (err, customers) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(customers);
  });
};


/**
 * Delete a Customer
 */
exports.delete = function (req, res) {
  var customer = req.customer;

  customer.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(customer);
  });
};

/**
 * Customer middleware
 */
function customerById(req, res, next, id){
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  Customer.findById(id).exec(function (err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return next(new Error('Failed to load customer ' + id));
    }
    req.customer = customer;
    next();
  });
}
exports.customerById = function (req, res, next, id) {
  return customerById(req, res, next, id);
};

exports.customerByBodyId = function (req, res, next) {
  return customerById(req, res, next, req.body.customerId);
};

