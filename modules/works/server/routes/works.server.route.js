'use strict';

/**
 * Module dependencies.
 */
var worksPolicy = require('../policies/works.server.policy'),
  works = require('../controllers/works.server.controller'),
  customers = require('../../../customers/server/controllers/customers.server.controller'),
  address = require('../../../customers/server/controllers/address.server.controller'),
  drawings = require('../../../drawings/server/controllers/drawings.server.controller');

module.exports = function (app) {
  // works collection routes
  app.route('/api/works').all(worksPolicy.isAllowed)
    .get(works.list)
    .post(customers.customerByBodyId, address.addressByBodyId, drawings.drawingByBodyId, works.create);

  // Single work routes
  app.route('/api/works/:workId').all(worksPolicy.isAllowed)
    .get(works.read)
    .put(customers.customerByBodyId, address.addressByBodyId, drawings.drawingByBodyId, works.update)
    .delete(works.delete);

  // Finish by binding the middleware
  app.param('workId', works.workById);
};