'use strict';

/**
 * Module dependencies.
 */
var drawingsPolicy = require('../policies/drawings.server.policy'),
  drawings = require('../controllers/drawings.server.controller'),
  girths = require('../../../work_settings/server/controllers/girths.server.controller'),
  materials = require('../../../work_settings/server/controllers/materials.server.controller');

module.exports = function (app) {
  // drawings collection routes
  app.route('/api/drawings').all(drawingsPolicy.isAllowed)
    .get(drawings.list)
    .post(materials.materialByBodyId, girths.girthByBodyId, drawings.create);

  // Single drawing routes
  app.route('/api/drawings/:drawingId')
    .all(drawingsPolicy.isAllowed)
    .get(drawings.read)
    .put(materials.materialByBodyId, girths.girthByBodyId, drawings.update)
    .delete(drawings.delete);

  // Finish by binding the middleware
  app.param('drawingId', drawings.drawingById);
};