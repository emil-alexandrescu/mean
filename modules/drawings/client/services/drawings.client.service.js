'use strict';

angular.module('drawings').factory('Drawings', ['$resource',
  function ($resource) {
    return $resource('api/drawings/:drawingId', {
      drawingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
