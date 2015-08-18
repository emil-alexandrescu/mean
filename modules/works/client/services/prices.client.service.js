'use strict';

angular.module('works.prices').factory('Prices', ['$resource',
  function ($resource) {
    var resource = $resource('api/prices/:materialId/:girthId', {
    	materialId: '@material',
      girthId: '@girth'
    }, {
      update: {
        method: 'PUT'
      }
    });

    return resource;
  }
]);
