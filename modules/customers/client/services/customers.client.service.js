'use strict';

//TODO this should be Users service
angular.module('customers').factory('Customers', ['$resource',
  function ($resource) {
    return $resource('api/customers/:customerId', {
      customerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
