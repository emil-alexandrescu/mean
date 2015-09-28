'use strict';

/**
 * Module dependencies.
 */
var worksPolicy = require('../policies/works.server.policy'),
  girths = require('../controllers/girths.server.controller'),
  prices = require('../controllers/prices.server.controller'),
  materials = require('../controllers/materials.server.controller');

module.exports = function (app) {
  // materials collection routes
  app.route('/api/materials').all(worksPolicy.isAllowed)
    .get(materials.list)
    .post(materials.create);

  // Single material routes
  app.route('/api/materials/:materialId').all(worksPolicy.isAllowed)
    .get(materials.read)
    .put(materials.update)
    .delete(materials.delete);

  // girths collection routes
  app.route('/api/girths').all(worksPolicy.isAllowed)
    .get(girths.list)
    .post(girths.create);

  // Single girth routes
  app.route('/api/girths/:girthId').all(worksPolicy.isAllowed)
    .get(girths.read)
    .put(girths.update)
    .delete(girths.delete);

  // prices collection routes
  app.route('/api/prices').all(worksPolicy.isAllowed)
    .get(prices.list);

  app.route('/api/prices/:materialId/:girthId').all(worksPolicy.isAllowed)
    .post(prices.create);

  // Single price routes
  app.route('/api/prices/:materialId/:girthId').all(worksPolicy.isAllowed, prices.findPriceByMaterialAndGirth)
    .get(prices.read)
    .put(prices.update)
    .delete(prices.delete);

  // Finish by binding the middleware
  app.param('materialId', materials.materialById);
  app.param('girthId', girths.girthById);
};
