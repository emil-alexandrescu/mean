'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Work = mongoose.model('Work'),
  Customer = mongoose.model('Customer'),
  Address = mongoose.model('Address'),
  async = require('async'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a work
 */
exports.create = function (req, res) {
  var work = new Work(req.body);
  var asyncTasks = [];

  //ship address
  asyncTasks.push(function(callback){
      Address.findById(req.body.ship_address).exec(function (err, address) {
          if (!err && address){
              work.ship_address = address;
          }
          callback(err, address);
      });
  });

  //billing address
  asyncTasks.push(function(callback){
      Address.findById(req.body.bill_address).exec(function (err, address) {
          if (!err && address){
              work.bill_address = address;
          }
          callback(err, address);
      });
  });

  //customer
  asyncTasks.push(function(callback){
      Customer.findById(req.body.customer).exec(function (err, customer) {
          if (!err && customer){
              work.customer = customer;
          }
          callback(err, customer);
      });
  });

  async.parallel(asyncTasks, function(err, results){
    //   if (err) {
    //       return res.status(400).send({message: errorHandler.getErrorMessage(err)});
    //   } else {
          work.save(function (err) {
              if (err) {
                  return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                  });
              } else {
                  res.json(work);
              }
          });
    //   }
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

    work = _.extend(work, _.pick(req.body,
        'description',
        'order_number',
        'req_date',
        'total',
        'sub_total',
        'tax',
        'drawings',
        'po',
        'order_or_quote'
    ));

    var asyncTasks = [];
    //ship address
    asyncTasks.push(function(callback){
        Address.findById(req.body.ship_address).exec(function (err, address) {
            if (!err && address){
                work.ship_address = address;
            }
            callback(err, address);
        });
    });

    //billing address
    asyncTasks.push(function(callback){
        Address.findById(req.body.bill_address).exec(function (err, address) {
            if (!err && address){
                work.bill_address = address;
            }
            callback(err, address);
        });
    });

    //customer
    asyncTasks.push(function(callback){
        Customer.findById(req.body.customer).exec(function (err, customer) {
            if (!err && customer){
                work.customer = customer;
            }
            callback(err, customer);
        });
    });

    async.parallel(asyncTasks, function(err, results){
        // if (err) {
        //     return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        // } else {
            work.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(work);
                }
            });
        // }
    });
};

/**
 * List of Works
 */
exports.list = function (req, res) {
  Work.find({}).populate(['customer', 'ship_address', 'bill_address']).exec(function (err, works) {
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

  Work.findById(id).populate(['customer', 'bill_address', 'ship_address']).exec(function (err, work) {
    if (err) {
      return next(err);
    } else if (!work) {
      return next(new Error('Failed to load work ' + id));
    }
    req.work = work;
    next();
  });
};
