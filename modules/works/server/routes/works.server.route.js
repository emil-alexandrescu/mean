'use strict';

/**
 * Module dependencies.
 */
var worksPolicy = require('../policies/works.server.policy'),
  works = require('../controllers/works.server.controller');

module.exports = function (app) {
  // works collection routes
  app.route('/api/works').all(worksPolicy.isAllowed)
    .get(works.list)
    .post(works.create);

  // Single work routes
  app.route('/api/works/:workId').all(worksPolicy.isAllowed)
    .get(works.read)
    .put(works.update)
    .delete(works.delete);

  // Finish by binding the middleware
  app.param('workId', works.workById);
};
