'use strict';

angular.module('work_settings.prices').factory('Prices', ['$resource',
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
