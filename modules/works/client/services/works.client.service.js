'use strict';

angular.module('works').factory('Works', ['$resource',
  function ($resource) {
    return $resource('api/works/:workId', {
      workId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
