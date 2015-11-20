'use strict';

//TODO this should be Users service
angular.module('customers').factory('Customers', ['$resource',
  function ($resource) {
    var resource = $resource('api/customers/:customerId', {
      customerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    resource.makeFullName = function(customer) {
        return customer.first_name + ' ' + customer.last_name + ' (' + customer.company + ')';
    };

    return resource;
  }
]);
