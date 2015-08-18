'use strict';

angular.module('works.materials').factory('Materials', ['$resource',
  function ($resource) {
    return $resource('api/materials/:materialId', {
      materialId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
