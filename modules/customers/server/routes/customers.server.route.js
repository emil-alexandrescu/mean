'use strict';

/**
 * Module dependencies.
 */
var customersPolicy = require('../policies/customers.server.policy'),
  address = require('../controllers/address.server.controller'),
  contact_info = require('../controllers/contact_info.server.controller'),
  customers = require('../controllers/customers.server.controller');

module.exports = function (app) {
  // customers collection routes
  app.route('/api/customers').all(customersPolicy.isAllowed)
    .get(customers.list)
    .post(customers.create);

  // Single customer routes
  app.route('/api/customers/:customerId').all(customersPolicy.isAllowed)
    .get(customers.read)
    .put(customers.update)
    .delete(customers.delete);

  app.route('/api/customers/:customerId/addresses').all(customersPolicy.isAllowed)
    .get(address.list)
    .post(address.create);

  app.route('/api/customers/:customerId/addresses/:addressId').all(customersPolicy.isAllowed)
    .get(address.read)
    .put(address.update)
    .delete(address.delete);

  app.route('/api/customers/:customerId/contact_info').all(customersPolicy.isAllowed)
    .get(contact_info.list)
    .post(contact_info.create);

  app.route('/api/customers/:customerId/contact_info/:contact_infoId').all(customersPolicy.isAllowed)
    .get(contact_info.read)
    .put(contact_info.update)
    .delete(contact_info.delete);

  // Finish by binding the customer middleware
  app.param('customerId', customers.customerById);
  app.param('addressId', address.addressById);
  app.param('contact_infoId', contact_info.contact_infoById);
};
