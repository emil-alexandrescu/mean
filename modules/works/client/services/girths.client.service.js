'use strict';

//TODO this should be Users service
angular.module('works.girths').factory('Girths', ['$resource',
  function ($resource) {
    return $resource('api/girths/:girthId', {
      girthId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
