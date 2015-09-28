'use strict';

angular.module('work_settings.materials').factory('Materials', ['$resource',
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
